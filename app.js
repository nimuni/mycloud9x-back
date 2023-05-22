// dotenv
require('dotenv').config();

// express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const hpp = require('hpp');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./js/passport');
const db = require('./db/db.js');

console.log(process.env.WEB_TITLE);

var app = express();

app.use(morgan(process.env.LOG_FORMAT));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

// 구동
db();
passportConfig();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024, // 1 GiB
    },
    abortOnLimit: true,
    createParentPath: true,
    useTempFiles: true,
    debug: true,
  })
);
// app.use(cors({origin: process.env.URI_ORIGIN, credentials: process.env.CREDENTIALS }));
app.use(cors({
  origin: [process.env.URI_ORIGIN, 'http://localhost:3000'],  // 임시로 로컬호스트의 요청 하용 TODO. 로컬호스트 삭제 필요
  credentials: process.env.CREDENTIALS === 'true'
}));
app.use(hpp());

const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

module.exports = app;
