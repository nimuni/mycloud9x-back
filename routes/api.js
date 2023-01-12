const router = require('express').Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/upload', function(req, res) {
  console.log(req.files.filename); // the uploaded file object
});

module.exports = router;