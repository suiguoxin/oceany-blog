var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');

router.get('/', function(req, res) {
	res.render('signup', {
		title: "OCEANY"
	});
});

router.post('/', function(req, res) {
	var email = req.query.email;
	var name = req.query.name;
	var password = req.query.password;

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