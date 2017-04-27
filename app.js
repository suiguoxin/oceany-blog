var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var config = require("config-lite");

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var indexRouter = require('./routes/index');
var signUpRouter = require('./routes/signup');

var app = express();

app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'foo',
    store: new MongoStore({
        url: 'mongodb://admin:admin@ds145009.mlab.com:45009/oceany'
    })
}));

app.use(flash());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

//添加模板必需的三个变量
app.use(function (req, res, next) {
    //req.locals.user = req.session.user;
    console.log("saving the flash info...");
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error').toString();

    console.log("flash info saved");
    next();
});

app.use('/', indexRouter);
app.use('/signup', signUpRouter);

app.get('/login', function (req, res) {
    res.render('login', {
        title: "OCEANY"
    });
});

app.get('/cfd', function (req, res) {
    res.render('cfd', {
        title: "OCEANY"
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
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