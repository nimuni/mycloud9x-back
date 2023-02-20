const router = require('express').Router();

// default api 설정
router.get('/', function(req, res, next) {
  res.send('respond with a resource2');
});

router.post('/upload', function(req, res) {
  console.log(req.files.filename); // the uploaded file object
});


// User api 설정
const userRouter = require('./user');
router.use('/user', userRouter);


module.exports = router;