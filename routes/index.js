var signUpRouter = require('./signup');
var loginRouter = require('./login');
var cfdRouter = require('./cfd');

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index', {
            title:"OCEANY"
        });
    });

    app.use('/signup', signUpRouter);
    app.use('/login', loginRouter);
    app.use('/cfd', cfdRouter);
};