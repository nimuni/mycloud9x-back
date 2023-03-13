const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
exports.generateRefreshToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
exports.accessTokenVerify = (token) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return false;
    }
    console.log(decoded);
    return decoded
  });
}
exports.refreshTokenVerify = (token) => {
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return false;
    }
    console.log(decoded);
    return decoded
  });
}

// middleware
exports.verifyJwt = (req, res, next) => {
  // 0: 헤더 1:payload-저장한정보 2:verify signature
  // 처리가 안되면 세션만료인 것으로 판별.
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedAccessToken;
  } catch (error) {
    // access token이 만료된 경우
    if (error.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
      }

      // refresh token 검증
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // refresh token으로 새로운 access token과 refresh token 발행
        const newAccessToken = this.generateAccessToken({id: decodedRefreshToken.id, provider: decodedRefreshToken.provider})
        const newRefreshToken = this.generateRefreshToken({id: decodedRefreshToken.id, provider: decodedRefreshToken.provider})

        // 새로 발행된 토큰 쿠키에 저장
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

        req.user = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
      } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid access token' });
    }
  }

  next();
}