var signUpRouter = require('./signup');
var loginRouter = require('./login');
var cfdRouter = require('./cfd');
var openFoamRouter = require('./openFoam');

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index', {
        });
    });

    app.use('/signup', signUpRouter);
    app.use('/login', loginRouter);
    app.use('/cfd', cfdRouter);
    app.use('/openFoam', openFoamRouter);
};