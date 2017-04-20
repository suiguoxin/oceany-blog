var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();

app.use(express.static('public'));

app.use('/', indexRouter);

app.get('/login', function(req, res){
	res.render('login', {
		title:"OCEANY"
	});
});

app.get('/signup', function(req, res){
	res.render('signup', {
		title:"OCEANY"
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});