module.exports = (app) => {
  const router = require('express').Router();
  const application = app;
  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

return router;
}