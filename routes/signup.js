var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');

router.get('/', function(req, res) {
	res.render('signup', {
		title: "OCEANY"
	});
});

router.post('/', function(req, res) {
	console.log ("Getting the user infomations ...");
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;

	// 待写入数据库的用户信息
	var user = {
		email: email,
		name: name,
		password: password
	};

	UserModel.create(user)
		.then(function(result) {
			res.render('cfd', {
				title: "OCEANY"
			});
		});
});

module.exports = router;