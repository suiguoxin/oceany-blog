let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
const saltRounds = 12;

let UserModel = require('../models/users');

router.get('/', function (req, res) {
    res.render('signup', {});
});

router.post('/', function (req, res) {
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    let repassword = req.body.repassword;

    try {
        if (!(name.length >= 4 && name.length <= 10)) {
            throw new Error('名字请限制在 4-10 个字符');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.render('signup', {
            email: email,
            name: name,
            password: password,
            repassword: repassword
        });
    }

    bcrypt.hash(password, saltRounds, function (err, password) {
        // 待写入数据库的用户信息
        let user = {
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
                if (e.message.match('E11000 duplicate key')) {
                    req.flash('error', "User name already exist");
                    return res.redirect('signup');
                }
            });
    });


});

module.exports = router;