let signUpRouter = require('./signup');
let loginRouter = require('./login');
let logoutRouter = require('./logout');
let profileRouter = require('./profile');
let cfdRouter = require('./cfd');
let openfoamRouter = require('./openfoam');
let softwaresRouter = require('./softwares');
let questionsRouter = require('./questions');
let publishRouter = require('./publish');
let menuRouter = require('./menu');
let aboutRouter = require('./about');

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
    app.use('/openfoam', openfoamRouter);
    app.use('/softwares', softwaresRouter);
    app.use('/questions', questionsRouter);
    app.use('/publish', publishRouter);
    app.use('/menu', menuRouter);
    app.use('/about', aboutRouter);
};