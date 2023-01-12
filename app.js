const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const hpp = require('hpp')

// dotenv
require("dotenv").config();
console.log(process.env.WEB_TITLE)

var app = express();

app.use(logger('dev'));
app.use(express.json());
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
app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use(hpp());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = requires('./routes/api')

app.use('/', indexRouter)(app);
app.use('/users', usersRouter)(app);
app.use('/api', apiRouter)(app)

module.exports = app;
