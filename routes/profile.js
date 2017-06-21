let express = require('express');
let router = express.Router();

//config
let config = require("config-lite")(__dirname);

//multer
let multer = require('multer');
let memoryStorage = multer.memoryStorage();
let uploadMemory = multer({storage: memoryStorage});

//qiniu
let qn = require('qn');
let client = qn.create({
    accessKey: config.qn.accessKey,
    secretKey: config.qn.secretKey,
    bucket: config.qn.bucket,
    origin: config.qn.origin,
    timeout: config.qn.timeout,
    uploadURL: config.qn.uploadURL
});

let UserModel = require('../models/users');

router.get('/', function (req, res) {
    let user = req.session.user;

    res.render('profile', {
        user: user
    });
});

//do not deal with avatar here
router.post('/', uploadMemory.single('avatar'), function (req, res) {
    let userId = req.session.user._id;
    let bio = req.body.bio;

    UserModel.updateUserById(userId, {bio: bio})
        .then(function (r) {
            req.flash('success', 'update profile succeed');
            //update session
            req.session.user.bio = bio;
            res.redirect('/profile');
        });
});

router.post('/uploadAvatar', uploadMemory.single('avatar'), function (req, res) {
    console.log(req.file);

    let userId = req.session.user._id;
    let avatar = req.file;

    //upload to qiniu
    client.upload(avatar.buffer, {key: req.file.fieldname + '-' + Date.now()}, function (err, result) {
        console.log(result);
        let cdn = config.qn.cdn;
        let src = cdn + result.key;
        //upload the user in db
        UserModel.updateUserById(userId, {avatar: src})
            .then(function () {
                //update session
                req.session.user.avatar = src;
                //return img src to ajax
                res.json({src: src});
            });
    });
});

module.exports = router;