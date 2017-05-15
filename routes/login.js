var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var UserModel = require('../models/users');

router.get('/', function (req, res) {
    res.render('login');
});

router.post('/', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;

    UserModel.getUserByname(name)
        .then(function (result) {
            var user = result;
            if (!user) {
                req.flash('error', 'user name does not exist');
                return res.redirect('back');
            }

            // why can't use async mode
            // bcrypt.compare(password, user.password, function(err, res) {
            //     if(res===false){
            //         req.flash('error', 'password is wrong');
            //         return res.redirect('back');
            //     }
            // });
            if (!bcrypt.compareSync(password, user.password)) {
                req.flash('error', 'password is wrong');
                return res.redirect('back');
            }

            req.session.user = user;
            req.flash('success', 'log in succeed');

            res.redirect('index');
        });
});

module.exports = router;