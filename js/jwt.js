const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  return jwt.sign({data:user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
exports.generateRefreshToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  // return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return jwt.sign({data:user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
exports.accessTokenVerify = (token) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return false;
    }
    return decoded
  });
}
exports.refreshTokenVerify = (token) => {
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return false;
    }
    return decoded
  });
}

// middleware
exports.verifyJwt = (req, res, next) => {
  // 0: 헤더 1:payload-저장한정보 2:verify signature
  // 처리가 안되면 세션만료인 것으로 판별.
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    // access 토큰 인증완료.
    const decodedAccessToken = this.accessTokenVerify(accessToken);
    req.user = decodedAccessToken;
    next();
  } catch (error) {
    // access token이 만료된 경우
    if (error.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
      }

      // refresh token 검증
      try {
        const decodedInfo = this.refreshTokenVerify(refreshToken);
        const userInfo = {
          provider: decodedInfo.provider,
          id: decodedInfo.id,
          email: decodedInfo.email,
          email_verified: decodedInfo.email_verified,
        }

        // refresh token으로 새로운 access token과 refresh token 발행
        const newAccessToken = this.generateAccessToken(userInfo)
        const newRefreshToken = this.generateRefreshToken(userInfo)

        // 새로 발행된 토큰 쿠키에 저장
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict'/* https 사용하는 경우. secure:true */})

        req.user = this.accessTokenVerify(newAccessToken);
      } catch (error) {
        // return res.status(401).json({ message: 'Invalid refresh token' });
        return res.redirect(`/login`)
      }
    } else {
      return res.status(401).json({ message: 'Invalid access token' });
    }
  }
  next();
}