require("dotenv").config();
const router = require('express').Router();
const passport = require('passport');
const userService = require('../service/userService')
const { encrypt, decrypt } = require("../js/crypto");
const { isEmpty } = require("../js/common.util");

/* GET user listing. */
router.get('/', async (req, res, next) => {
  let users = await userService.find();
  users.forEach(element => {
    delete element.firstname;
  });
  
  res.send(users);
});
router.get('/:id', async (req, res, next) => {
  let result = await userService.findOne({id:req.params.id});

  res.send(result);
});
router.post('/', async (req, res, next) => {
  // DB에서 변경처리
  // 회원가입 창에서 전송된 데이터를 바탕으로 계정 생성
  let newUserObj = {...req.body};
  newUserObj.password = encrypt(newUserObj.password);
  let result = await userService.register(newUserObj);
  res.send(result);
});
router.put('/:id', async (req, res, next) => {
  // DB에서 변경처리
  console.log("call put /api/user");
  let findObj={
    id:req.params.id
  }
  let changeObj = {};
  if(!isEmpty(req.body.password)) {
    changeObj.password = encrypt(req.body.password);
  }
  if(!isEmpty(req.body.email)) {
    changeObj.email = req.body.email
  }
  if(!isEmpty(req.body.email_verified)) {
    changeObj.email_verified = req.body.email_verified
  }

  let result = await userService.update(findObj, changeObj);
  res.send(result);
});
router.delete('/:id', async (req, res, next) => {
  // DB에서 변경처리
  console.log("call delete /api/user");
  res.send("call /api/user/:id delete");
});
router.put('/allow', async (req, res, next) => {
  // user 승인여부를 바꿈
  // data로 userId 및 allow:"y" / "n" 값을 부여.
  // 승인 혹은 승인취소 시 폴더가 생성되어있는지 확인 후 폴더 생성.
  // 폴더가 존재하는 경우 아무 동작을 취하지 않음.
  res.send('respond with a resource4');
});
router.post('/findId', async (req, res, next) => {
  // DB에서 변경처리
  // post로 들어오는 param 값 중 email 값을 읽어서 
  // 해당 email로 아이디 전송 혹은 아이디 리턴
  res.send('respond with a resource3');
});
router.post('/findPwd', async (req, res, next) => {
  // DB에서 변경처리
  // post로 들어오는 param 값 ID와 email 값을 비교 후 맞으면 
  // 해당 email로 임시 비밀번호 전송
  res.send('respond with a resource3');
});
router.get('/duplicateIdCheck/:id', async (req, res, next) => {
  // DB에서 변경처리
  // param으로 들어온 id값을 통해서 비교 후 res.send로 true/false 리턴
  res.send('respond with a resource1');
});
router.get('/duplicateEmailCheck/:email', async (req, res, next) => {
  // DB에서 변경처리
  // param으로 들어온 id값을 통해서 비교 후 res.send로 true/false 리턴
  res.send('respond with a resource1');
});

module.exports = router;