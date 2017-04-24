var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var signUpRouter = require('./routes/signup');

var app = express();

app.use(express.static('public'));

app.use('/', indexRouter);

app.use('/signup', signUpRouter);

app.get('/login', function(req, res){
	res.render('login', {
		title:"OCEANY"
	});
});

app.get('/cfd', function(req, res){
  res.render('cfd', {
    title:"OCEANY"
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});