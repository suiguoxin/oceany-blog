var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});

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

router.post('/uploadAvatar', upload.single('avatar'), function (req, res) {
    console.log("upload avatar in profile.js");
    console.log(req.file);
    console.log(req.body);

    res.send('Upload Done !');
    // res.json({imgSrc: "public/uploads/" + avatar.filename});
});

module.exports = router;