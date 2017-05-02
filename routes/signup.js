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

    try{
        if(!(name.length>=1 && name.length <= 10)){
            throw new Error('The length of name show between 1 and 10');
        }
        if(password.length <3){
            throw new Error('The length of password should be at least 3');
        }
    } catch (e){
        req.flash('error',e.message);
        return res.redirect('signup');
    }

    password = sha1(password);

    // 待写入数据库的用户信息
    var user = {
        email: email,
        name: name,
        password: password
    };

    UserModel.create(user)
        //result 什么属性？？ops是什么？？
        .then(function (result) {
            user = result.ops[0];
            delete user.password;
            req.session.user = user;
            req.flash('success', 'inscription succeed');

            res.redirect('index');
        })
        .catch(function (e) {
            if(e.message.match('E11000 duplicate key')){
                req.flash('error',"User name already exist");
                return res.redirect('signup');
            }
        });
});

module.exports = router;