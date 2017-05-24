let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');

let UserModel = require('../models/users');

router.get('/', function (req, res) {
    res.render('login');
});

router.post('/', function (req, res) {
    let name = req.body.name;
    let password = req.body.password;

    UserModel.getUserByname(name)
        .then(function (result) {
            let user = result;
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

router.get('/github', function (req, res) {
    res.redirect('http://github.com')
});

module.exports = router;