var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({storage: storage});

var UserModel = require('../models/users');

router.get('/', function (req, res) {
    var user = req.session.user;

    res.render('profile', {
        user: user
    });
});

router.post('/', upload.single('avatar'), function (req, res) {
    var userId = req.session.user._id;
    var bio = req.body.bio;

    UserModel.updateUserById(userId, {bio: bio})
        .then(function (r) {
            req.flash('success', 'update profile succeed');
            //update session
            req.session.user.bio = bio;
            res.redirect('/profile');
        });
});

router.post('/uploadAvatar', upload.single('avatar'), function (req, res) {
    console.log(req.file);
    console.log(req.body);

    var userId = req.session.user._id;
    var avatar = req.file;
    var src = "uploads/" + avatar.filename;

    UserModel.updateUserById(userId, {avatar: src})
        .then(function () {
            //update session
            req.session.user.avatar = src;
            //return img src to ajax
            res.json({src: src});
        });
});

module.exports = router;