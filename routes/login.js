var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var UserModel = require('../models/users');

router.get('/', function (req, res) {
    res.render('login');
});

router.post('/', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;

    password = sha1(password);

    UserModel.getUserByname(name)
        .then(function (result) {
            var user = result;
            if (!user) {
                req.flash('error', 'user name does not exist');
                return res.redirect('back');
            }

            if (user.password !== password) {
                req.flash('error', 'password is wrong');
                return res.redirect('back');
            }

            req.session.user = user;
            req.flash('success', 'log in succeed');

            res.redirect('index');
        });
});

module.exports = router;