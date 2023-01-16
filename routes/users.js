const router = require('express').Router();

router.post('/login', function(req, res, next) {
  // data 값으로 ID 및 비밀번호를 받아서 로그인 처리.
  // jwt or Oauth2를 이용한 로그인 처리 필요.
  res.send('respond with a resource3');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource1');
});
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource2');
});
router.post('/:id', function(req, res, next) {
  // DB에서 변경처리
  // 회원가입 창에서 전송된 데이터를 바탕으로 계정 생성
  res.send('respond with a resource3');
});
router.put('/:id', function(req, res, next) {
  // DB에서 변경처리
  res.send('respond with a resource4');
});
router.put('/allow', function(req, res, next) {
  // user 승인여부를 바꿈
  // data로 userId 및 allow:"y" / "n" 값을 부여.
  // 승인 혹은 승인취소 시 폴더가 생성되어있는지 확인 후 폴더 생성.
  // 폴더가 존재하는 경우 아무 동작을 취하지 않음.
  res.send('respond with a resource4');
});
router.delete('/:id', function(req, res, next) {
  // DB에서 변경처리
  res.send('respond with a resource5');
});
router.post('/findId', function(req, res, next) {
  // DB에서 변경처리
  // post로 들어오는 param 값 중 email 값을 읽어서 
  // 해당 email로 아이디 전송 혹은 아이디 리턴
  res.send('respond with a resource3');
});
router.post('/findPwd', function(req, res, next) {
  // DB에서 변경처리
  // post로 들어오는 param 값 ID와 email 값을 비교 후 맞으면 
  // 해당 email로 임시 비밀번호 전송
  res.send('respond with a resource3');
});
router.get('/duplicateIdCheck/:id', function(req, res, next) {
  // DB에서 변경처리
  // param으로 들어온 id값을 통해서 비교 후 res.send로 true/false 리턴
  res.send('respond with a resource1');
});
router.get('/duplicateEmailCheck/:email', function(req, res, next) {
  // DB에서 변경처리
  // param으로 들어온 id값을 통해서 비교 후 res.send로 true/false 리턴
  res.send('respond with a resource1');
});

module.exports = router;