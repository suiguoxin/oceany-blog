var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');

router.get('/', function (req, res) {
    var user = req.session.user;

    res.render('profile', {
        user: user
    });
});

router.post('/', function (req, res) {
    var userId = req.session.user._id;
    var bio = req.body.bio;

    console.log(req.body);
    console.log(req.files);

    UserModel.updateUserById(userId, {bio: bio})
        .then(function () {
            req.flash('success', 'update profile succeed');
            res.redirect('/profile');
        });
});

module.exports = router;