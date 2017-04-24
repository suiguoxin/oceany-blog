var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('signup', {
		title: "OCEANY"
	});
});

router.post('/', function(req, res) {
	var email = req.fields.email;
	var name = req.fields.name;
	var password = req.fields.password;

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