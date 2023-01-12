module.exports = (app) => {
  const router = require('express').Router();
  const application = app;

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  return router;
}