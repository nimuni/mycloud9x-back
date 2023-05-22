const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  return jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s'/* '15m' */ });
};
exports.generateRefreshToken = (user) => {
  // jwt.sign(payload, secretKey, options)
  // return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return jwt.sign({ data: user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
exports.accessTokenVerify = (token) => {
  return new Promise((resolve, reject) => {
    console.log("call accessTokenVerify")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log("verify error")
        console.error(err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
exports.refreshTokenVerify = (token) => {
  return new Promise((resolve, reject) => {
    console.log("call refreshTokenVerify")
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log("verify error")
        console.error(err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
exports.reGenerateAccessToken = async (refreshToken) => {
  const decodedInfo = await this.refreshTokenVerify(refreshToken);
  const userInfo = {
    provider: decodedInfo.data.provider,
    id: decodedInfo.data.id,
    _id: decodedInfo.data._id,
    email: decodedInfo.data.email,
    email_verified: decodedInfo.data.email_verified,
    role: decodedInfo.data.role,
  };
  return this.generateAccessToken(userInfo);
};

// middleware
exports.verifyJwt = async (req, res, next) => {
  // 0: 헤더 1:payload-저장한정보 2:verify signature
  // 처리가 안되면 세션만료인 것으로 판별.
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    // access 토큰 인증완료.
    const decodedAccessToken = await this.accessTokenVerify(accessToken);
    req.user = decodedAccessToken.data;
    next();
  } catch (error) {
    console.log("catch error")
    console.log(error)
    console.log(error.name)
    // access token이 만료된 경우
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid access token' });
    } else {
      return res.status(500).send(error)
    }
  }
};
