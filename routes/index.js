var signUpRouter = require('./signup');
var loginRouter = require('./login');
var logoutRouter = require('./logout');
var profileRouter = require('./profile');
var cfdRouter = require('./cfd');
var openFoamRouter = require('./openFoam');
var questionsRouter = require('./questions');
var publishRouter = require('./publish');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {});
    });
    app.get('/index', function (req, res) {
        res.render('index', {});
    });

    app.use('/signup', signUpRouter);
    app.use('/login', loginRouter);
    app.use('/logout', logoutRouter);
    app.use('/profile', profileRouter);
    app.use('/cfd', cfdRouter);
    app.use('/openFoam', openFoamRouter);
    app.use('/questions', questionsRouter);
    app.use('/publish', publishRouter);
};