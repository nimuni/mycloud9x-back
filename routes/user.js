const router = require('express').Router();
const userService = require('../service/userService')
const { isEmptyObj } = require("../js/common.util");
const passport = require('passport');
const { generateAccessToken, generateRefreshToken, verifyJwt } = require("../js/jwt");

/* GET user listing. */
router.get('/', async (req, res, next) => {
  try {
    let users = await userService.findAll();
    if(users?.length > 0){
      res.status(200).send(users);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    let user = await userService.findOne({id:req.params.id});
    if(user){
      res.status(200).send(user);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.post('/', async (req, res, next) => {
  try {
    let user = await userService.register(req.body);
    if(user){
      res.status(201).send();
    } else {
      // 가입실패.
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.put('/:id', async (req, res, next) => {
  try {
    let user = await userService.update({id:req.params.id}, req.body);
    if(user){
      res.status(201).send(user);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post('/findId', async (req, res, next) => {
  try {
    await userService.findAccount("id", req.body);
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.post('/findPwd', async (req, res, next) => {
  try {
    await userService.findAccount("pwd", req.body);
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get('/verifyCode/:code', async (req, res, next) => {
  try {
    let isVerified = await userService.verifyCode({code:req.params.code});
    if(isVerified){
      res.status(200).send(true)
      // TODO. url로 리다이렉션.
      // const url = ""
      // res.redirect(url)
    } else {
      res.status(200).send(false)
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get('/duplicateIdCheck/:id', async (req, res, next) => {
  try {
    let user = await userService.findOne({id:req.params.id});
    if(isEmptyObj(user)){
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get('/duplicateEmailCheck/:email', async (req, res, next) => {
  try {
    let user = await userService.findOne({email:req.params.email});
    if(isEmptyObj(user)){
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
router.delete('/:id', async (req, res, next) => {
  // DB에서 변경처리
  console.log("call delete /api/user");
  res.send("call /api/user/:id delete. 현재 미구현");
});
router.put('/allow', async (req, res, next) => {
  // user 승인여부를 바꿈
  // data로 userId 및 allow:"y" / "n" 값을 부여.
  // 승인 혹은 승인취소 시 폴더가 생성되어있는지 확인 후 폴더 생성.
  // 폴더가 존재하는 경우 아무 동작을 취하지 않음.
  res.send('call /api/user/allow. 현재 미구현');
});

module.exports = router;