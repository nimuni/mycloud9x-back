const router = require('express').Router();
const passport = require('passport');
const { generateAccessToken, generateRefreshToken, verifyJwt } = require('../js/jwt');

// default api 설정
router.get('/', function (req, res, next) {
  res.send('respond with a resource2');
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: '로그인에 실패했습니다.',
        user: user,
      });
    } else {
      req.login(user, { session: false }, (err) => {
        if (err) res.send(err);
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.json({ accessToken: accessToken });
    }
  })(req, res, next);
});

router.get('/verifyToken', verifyJwt, async (req, res, next) => {
  console.log('call /api/user/verifyToken');
  res.send('success token verify');
});
router.get('/logout', verifyJwt, (req, res) => {
  res.clearCookie('refreshToken');
  res.redirect('/login');
});

// 구글 로그인 요청을 처리하는 라우터.
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// 회원가입 요청을 처리하는 라우터. 본질적으로 같은 콜백으로 보낸다.
router.get('/register/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 로그인 콜백 요청을 처리하는 라우터
router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  // 콜백된 이후 passport의 인증과정을 먼저 거치면서
  // 마지막에 리턴된 done(null, profile); 을 통해서 값을 가져옴
  const user = req.user;
  console.log('after /auth/google/callback');
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // cookie에 refreshToken과 accessToken을 설정.
  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  // res.json({ accessToken: accessToken });
  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.redirect(`/`);
});

// User api 설정
const userRouter = require('./user');
router.use('/user', userRouter);

const driveRouter = require('./drive');
router.use('/drive', driveRouter);

const fileRouter = require('./file');
router.use('/file', fileRouter);

module.exports = router;
