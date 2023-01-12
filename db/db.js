const mongoose = require('mongoose');
require("dotenv").config();
module.exports = () => {
  function connect() {
    mongoose.connect(process.env.MONGO_ATLAS_URI, function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);
  require('../service/user.js');
};