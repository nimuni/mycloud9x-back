const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const hpp = require('hpp')
const fileUpload = require("express-fileupload");
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./middleware/passport');
const db = require('./db/db.js');


// dotenv
require("dotenv").config();
console.log(process.env.WEB_TITLE)

var app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(session({
	secret:process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false
}))
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

// 구동
db();
passportConfig();


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload(
	{
		limits: {
			fileSize: 1024*1024*100 // 100 MiB
		},
		abortOnLimit: true,
		createParentPath: true,
		useTempFiles: true,
		tempFileDir: '/tmp/',
		debug: true
	}
));
// app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use(cors())
app.use(hpp());

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api')

app.use('/', indexRouter);
app.use('/api', apiRouter)

module.exports = app;
