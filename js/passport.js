const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userServiceImpl = require("../service/impl/userServiceImpl")

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    console.log("call serializeUser")
    console.log(user)
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    // serializeUser에서 넘긴 user, 즉 Google id가 읽힘
    console.log("call deserializeUser") 
    console.log(user)
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'password',
    session: true, // 세션에 저장 여부
    passReqToCallback: false, // true 변경시 뒤 콜백이 req, id, password, done 로 변경됨
  }, async (id, password, done) => {
    const projectionUserObj = {
      id: 1,
      provider: 1,
      password: 1,
      email_verified: 1
    }
    const user = await userServiceImpl.findOne({id:id}, projectionUserObj)
    if(user) {
      if(user.provider != "ownAPI") return done(null, false, { message: '자체 가입회원이 아닙니다.' });
      if(!user.email_verified) return done(null, false, { message: '이메일 인증이 진행되지 않았습니다.' });
      user.comparePassword(password, (passError, isMatch) => {
        if (isMatch) {
          return done(null, {id: user.id, provider: user.provider});
        }
        return done(null, false, { message: '비밀번호가 틀렸습니다' });
      });
    } else {
      return done(null, false, { message: '존재하지 않는 아이디입니다' });
    }
  }));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // 구글로그인 이후 반환되는 인자값들
    console.log("call GoogleStrategy")
    console.log(accessToken)
    console.log(profile)

    // accessToken, refreshToken 처리 및 에러 반환

    // profile 반환(필요한경우)


    // 이곳에서 실제 로그인 인증을 처리합니다.
    // 인증이 성공하면 done(null, user)를 호출합니다.
    // 인증이 실패하면 done(null, false)를 호출합니다.
    // const user = await userServiceImpl.findOne({}, projectionUserObj)

    // example
    // profile에서 로그인한 사용자의 정보를 가져옵니다.
    // const user = {
    //   email: profile.emails[0].value,
    //   name: profile.displayName
    // };
    done(null, profile);
  }))
};