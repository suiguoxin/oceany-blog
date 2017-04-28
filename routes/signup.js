var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var UserModel = require('../models/users');

router.get('/', function (req, res) {
    res.render('signup', {});
});

router.post('/', function (req, res) {
    console.log("Getting the user infomations ...");
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;

    password = sha1(password);

    // 待写入数据库的用户信息
    var user = {
        email: email,
        name: name,
        password: password
    };

    UserModel.create(user)
        .then(function (result) {
            //user = result.ops[0];
            //req.session.user = user;
            req.flash('success', 'inscription succeed');
            req.flash('error', 'inscription error');

            res.redirect('index');
        });
});

module.exports = router;