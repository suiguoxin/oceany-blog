let express = require('express');
let path = require('path');
let pkg = require('./package.json');
//used to acitiver req.body
let bodyParser = require('body-parser');
let multer = require('multer'); // v1.0.5
//config
let config = require("config-lite")(__dirname);
//session
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash');
//routes
let routes = require('./routes/index');

let app = express();

app.use(express.static('assets'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

app.use(flash());
//userful ??
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

//local variables
app.locals.oceany = {
    title: pkg.name,
    description: pkg.description
};

//添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();

    next();
});

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
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

const port = process.env.PORT || config.port;
app.listen(port, function () {
    console.log(`${pkg.name} listening on port ${port}!`);
});