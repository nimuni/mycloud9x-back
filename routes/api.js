const router = require('express').Router();
const passport = require('passport');
const { generateAccessToken, generateRefreshToken, verifyJwt } = require("../js/jwt");

// default api 설정
router.get('/', function(req, res, next) {
  res.send('respond with a resource2');
});

router.post('/upload', function(req, res) {
  console.log(req.files.filename); // the uploaded file object
});

router.post("/login", async (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if(err || !user) {
      return res.status(400).json({
        message: '로그인에 실패했습니다.',
        user: user
      })
    } else {
      req.login(user, { session:false }, (err) => {
        if(err) res.send(err);
      })

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, { httpOnly: true});
      res.json({accessToken: accessToken});
    }
  })(req, res, next);
});

router.get("/verifyToken", verifyJwt, async (req, res, next) => {
  console.log("call /api/user/verifyToken")
  res.send("1234")
})

// 구글 로그인 요청을 처리하는 라우터. 
// Front-end에서 http://nimuni.ml:8080/api/login/google 로 리다이렉트 시키면 됨.
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 로그인 콜백 요청을 처리하는 라우터
router.get('/login/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // 콜백된 이후 passport의 인증과정을 먼저 거치면서
  // 마지막에 리턴된 done(null, profile); 을 통해서 값을 가져옴
  const user = req.user;
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // cookie에 refreshToken과 accessToken을 설정.
  res.cookie('refreshToken', refreshToken, { httpOnly: true});
  // res.json({ accessToken: accessToken });
  res.cookie('accessToken', accessToken, { httpOnly: true});
  res.redirect(`/`)
});


// User api 설정
const userRouter = require('./user');
router.use('/user', userRouter);




module.exports = router;