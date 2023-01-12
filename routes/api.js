module.exports = (app) => {
  const router = require('express').Router();
  const application = app;

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  app.post('/upload', function(req, res) {
    console.log(req.files.filename); // the uploaded file object
  });
  
  return router;
}