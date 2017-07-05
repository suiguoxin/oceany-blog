let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
const saltRounds = 12;

let UserModel = require('../models/users');
let LocalAuthModel = require('../models/localAuths');

router.get('/', function (req, res) {
    res.render('signup', {});
});

router.post('/', function (req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    const patt = /^[a-z][\w\.]{2,22}[a-z0-9]$/i;

    try {
        // if (!(username.length >= 4 && username.length <= 10)) {
        if (!patt.test(username)) {
            throw new Error("用户名以字母开头，长度在4到24之间，不能包含数字，字母，'_'和'.'以外的特殊字符");
        }
        if (password.length < 4) {
            throw new Error('密码至少 4 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        req.flash('error', e.message);
        /**
         * with redirect we can't transfer params
         * with render the flash message will not be refreshed
         * TODO: transfer to AJAX
         */
        res.redirect('signup');
    // , {
    //         email: email,
    //             username: username,
    //             password: password,
    //             repassword: repassword
    //     }
        return ;
    }

    // 待写入数据库的用户信息
    let user = {
        email: email,
        name: username,
        role: 'normal'
    };

    UserModel.create(user)
        .then(function (result) {
            //result 什么属性？？ops是什么？？
            let user = result.ops[0];
            //set the password
            bcrypt.hash(password, saltRounds, function (err, password) {
                let localAuth = {
                    user_id: user._id,
                    username: username,
                    password: password
                };
                LocalAuthModel.create(localAuth)
                    .then(function () {
                        req.session.user = user;
                        req.flash('success', 'inscription succeed');

                        res.redirect('index');
                    })
                    .catch(function (e) {
                        if (e.message.match('E11000 duplicate key')) {
                            req.flash('error', "username already exist");
                            return res.redirect('signup');
                        }
                    });

            });
        });

});

module.exports = router;