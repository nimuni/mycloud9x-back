const mongoose = require('mongoose');
require("dotenv").config();

const connect = () => {
  // 몽구스와 몽고디비 연결하는 부분
  mongoose.connect(process.env.MONGO_ATLAS_URI, {
    dbName: 'mycloud9x',
    useNewUrlParser: true,
  }, (error) => {
    if (error) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결 성공');
    }
  });
};

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

module.exports = connect;