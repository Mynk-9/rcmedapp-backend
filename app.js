var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var session = require('express-session');
// var fileUpload = require('express-fileupload');

var config = require('./config/config');
var router = require('./routes/index');
require('./Passport/PassportJwt');
var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileUpload());

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Add the postgres or the mongoose middleware as well for session management.
// MongoDB backend: https://www.npmjs.com/package/connect-mongodb-session
// Sequelize Backend: https://www.npmjs.com/package/connect-session-sequelize
// Postgres Backend: https://www.npmjs.com/package/connect-pg-simple

// For other options: https://github.com/expressjs/session#compatible-session-stores

app.use(
  session({
    secret: config.app.sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // cors header
  if (req.method == 'OPTIONS') {
    // In very simple terms, this is how you handle OPTIONS request in nodejs
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, HEAD');
    res.header('Access-Control-Max-Age', '1728000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Authorization, X-AUTH-TOKEN');
    res.header('Content-Length', '0');
    res.sendStatus(208);
  } else {
    next();

    // Google analytics logging comes here
  }

  //    next();
});

app.get('/', function (req, res) {
  console.log('Welcome to the app');
  res.status(200).json({
    success: true,
    message: 'Welcome to medical reminder app',
  });
});

app.use('/api/v1', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  // console.log(err);
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (err.status != 404) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  } else if (err.status == 404) {
    res.status(404).json({
      success: false,
      status: 404,
      message: 'Endpoint not found',
    });
  } else {
    res
      .status(200)
      .json({ success: true, message: 'Welcome to the api. Please register yourself to get an access token.' });
  }
});

module.exports = app;

if (require.main == module) {
  // This is the message you are supposed to get if the app ran correctly and all imports are success
  console.log('\n\n [app.js] Success: No errors found in the app \n\n');
}

/*
  const { exec } = require('child_process');
  exec('sudo ln -s /cloudsql/{{original_socket}} /cloudsql/.s.PGSQL.5432', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
*/
