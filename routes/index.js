require("dotenv").config();
const router = require('express').Router();
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const fs = require("fs");
const path = require('path')
router.use(passport.initialize());
router.use(passport.session());
// login이 최초로 성공했을 때만 호출되는 함수
// done(null, user.id)로 세션을 초기화 한다.
passport.serializeUser(function (user, done) {
  console.log("call serializeUser")
  console.log(user)
  console.log(user.id) // google id를 넘김
	done(null, user.id);
});
// 사용자가 페이지를 방문할 때마다 호출되는 함수
// done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
passport.deserializeUser(function (id, done) {
  console.log("call deserializeUser") // serializeUser에서 넘긴 user.id, 즉 Google id가 읽힘
  console.log(id)
	done(null, id);
});

// Google login 전략
// 로그인 성공 시 callback으로 request, accessToken, refreshToken, profile 등이 나온다.
// 해당 콜백 function에서 사용자가 누구인지 done(null, user) 형식으로 넣으면 된다.
// 이 예시에서는 넘겨받은 profile을 전달하는 것으로 대체했다.
passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
			passReqToCallback: true,
		},
		function (request, accessToken, refreshToken, profile, done) {
			return done(null, profile);
		}
	)
);
/* GET home page. */
router.get('/main', function(req, res, next) {
  console.log("visit /")
  console.log(req.user)

  if (!req.user) return res.redirect("/login");
  fs.readFile(path.join(__dirname, "../public/main.html"), (error, data) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
router.get('/login', function(req, res, next) {
  if (req.user) return res.redirect("/");
  fs.readFile(path.join(__dirname, "../public/login.html"), (error, data) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
// google login 화면
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// google login 성공과 실패 리다이렉트
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
      successRedirect: "/main",
      failureRedirect: "/login",
  })
);
// logout
router.get("/logout", (req, res) => {
  // req.logout();
  res.redirect("/login");
});

module.exports = router;