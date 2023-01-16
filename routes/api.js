const router = require('express').Router();

// default api 설정
router.get('/', function(req, res, next) {
  res.send('respond with a resource2');
});

router.post('/upload', function(req, res) {
  console.log(req.files.filename); // the uploaded file object
});


// Users api 설정
const usersRouter = require('./users');
router.use('/users', usersRouter);


module.exports = router;