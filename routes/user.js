require("dotenv").config();
const router = require('express').Router();
const passport = require('passport');
const userService = require('../service/userService')

router.post(
  '/login',
  passport.authenticate('local', {failureRedirect: '/'}), 
  (req, res, next) => {
  console.log("call post /api/user/login");
});
router.get('/login/payload', (req, res, next) => {
  console.log("call get /api/user/payload");
});

/* GET user listing. */
router.get('/', async (req, res, next) => {
  console.log("call get /api/user");
  let result = await userService.find();
  console.log(result);
  res.send('respond with a resource1');
});
router.get('/:id', (req, res, next) => {
  res.send('respond with a resource2');
});
router.post('/:id', (req, res, next) => {
  console.log("call post /api/user/:id");
  // DB에서 변경처리
  // 회원가입 창에서 전송된 데이터를 바탕으로 계정 생성
  res.send('respond with a resource3');
});
router.put('/:id', (req, res, next) => {
  // DB에서 변경처리
  res.send('respond with a resource4');
});
router.put('/allow', (req, res, next) => {
  // user 승인여부를 바꿈
  // data로 userId 및 allow:"y" / "n" 값을 부여.
  // 승인 혹은 승인취소 시 폴더가 생성되어있는지 확인 후 폴더 생성.
  // 폴더가 존재하는 경우 아무 동작을 취하지 않음.
  res.send('respond with a resource4');
});
router.delete('/:id', (req, res, next) => {
  // DB에서 변경처리
  res.send('respond with a resource5');
});
router.post('/findId', (req, res, next) => {
  // DB에서 변경처리
  // post로 들어오는 param 값 중 email 값을 읽어서 
  // 해당 email로 아이디 전송 혹은 아이디 리턴
  res.send('respond with a resource3');
});
router.post('/findPwd', (req, res, next) => {
  // DB에서 변경처리
  // post로 들어오는 param 값 ID와 email 값을 비교 후 맞으면 
  // 해당 email로 임시 비밀번호 전송
  res.send('respond with a resource3');
});
router.get('/duplicateIdCheck/:id', (req, res, next) => {
  // DB에서 변경처리
  // param으로 들어온 id값을 통해서 비교 후 res.send로 true/false 리턴
  res.send('respond with a resource1');
});
router.get('/duplicateEmailCheck/:email', (req, res, next) => {
  // DB에서 변경처리
  // param으로 들어온 id값을 통해서 비교 후 res.send로 true/false 리턴
  res.send('respond with a resource1');
});

module.exports = router;