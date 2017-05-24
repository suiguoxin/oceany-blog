let express = require('express');
let router = express.Router();
//multer
let multer = require('multer');
let memoryStorage = multer.memoryStorage();
let uploadMemory = multer({storage: memoryStorage});
//qiniu
let qn = require('qn');
let client = qn.create({
    accessKey: 'IThkAny7wzlPGCR2pcJT8IrWkdes0Ic7PR38OwoQ',
    secretKey: '4lUiAwT3jymK85eFu85PboWTjuv6wLM8wMO8oCEs',
    bucket: 'oceany',
    origin: 'http://oceany.u.qiniudn.com',
    timeout: 3600000, // default rpc timeout: one hour
    uploadURL: 'http://up-z2.qiniu.com/' // the app outside of China
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
    client.upload(avatar.buffer, {key: req.file.fieldname+ '-' + Date.now()}, function (err, result) {
        console.log(result);
        let url = 'http://oq29i4a0h.bkt.clouddn.com/';
        let src = url+result.key;
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