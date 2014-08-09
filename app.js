var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var segment = require('./routes/segmentIO');
var track = require('./routes/track');
var auth = require('./routes/auth');
var nodeCache = require( "node-cache" );

//Required configuration 
var config = require('config');
var MongoClient = require('mongodb').MongoClient;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setting node-cache as global varible
app.set('nodeCache', new nodeCache({ stdTTL: 10, checkperiod: 300}));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/gstrack/pixel', track.getPixel);
app.get('/gstrack/clicklink', track.getRedirect);
app.post('/segmentio/event', auth.verifyAccessToken, segment.post);

//Should always be at end -----------
/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
app.set('port', process.env.PORT || 3000);

MongoClient.connect(config.get('mongodb_connection'), function (err, db) {
  if (err) {
    console.error('✗ MongoDB Connection Error. Make sure MongoDB is running.');
    throw err;
  }
  //Mongo connection established
  app.set('mongoConnection', db);
  app.listen(app.get('port'), function () {
    console.log("✔ Express server listening on port %d in %s mode.", app.get('port'), app.get('env'));
  });
});

// Print cache stats preriodically
setInterval(function() {
  var nodecache = app.get('nodeCache');
  console.log(new Date().toISOString() +  ': Cache stats ' , (nodecache.getStats()));
}, 60000);