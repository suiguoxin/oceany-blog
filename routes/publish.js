var express = require('express');
var router = express.Router();
//multer
var multer = require('multer');
var memoryStorage = multer.memoryStorage();
var uploadMemory = multer({storage: memoryStorage});
//qiniu
var qn = require('qn');
var client = qn.create({
    accessKey: 'IThkAny7wzlPGCR2pcJT8IrWkdes0Ic7PR38OwoQ',
    secretKey: '4lUiAwT3jymK85eFu85PboWTjuv6wLM8wMO8oCEs',
    bucket: 'oceany',
    origin: 'http://oceany.u.qiniudn.com',
    timeout: 3600000, // default rpc timeout: one hour
    uploadURL: 'http://up-z2.qiniu.com/' // the app outside of China
});

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    res.render('publish', {
    });
});

router.post('/', function (req, res) {
    console.log("Pulishing the new post...");
    var author = req.session.user._id;
    var title = req.body.title;
    var section = req.body.section;
    var index = req.body.index;
    var content = req.body.content;

    // 待写入数据库的用户信息
    var post = {
        author: author,
        title: title,
        section: section,
        index: index,
        content: content,
        pv: 0
    };

    PostModel.create(post)
        .then(function (result) {
            post = result.ops[0];
            req.flash('success', 'post-components succeed');
            //如何在字符串中间使用变量？？
            res.redirect('/cfd/' + post._id);
            //res.redirect(`/${section}/${post._id}`);
        });
});

router.post('/uploadPost', uploadMemory.single('postFile'), function (req, res) {
    console.log("uploading post in router...");

    var content = req.file.buffer.toString();

    res.json({content: content});
});

router.post('/uploadImg', uploadMemory.single('postImg'), function (req, res) {
    console.log(req.file);

    var postImg = req.file;

    client.upload(postImg.buffer, {key: postImg.fieldname+ '-' + Date.now()}, function (err, result) {
        var url = 'http://oq29i4a0h.bkt.clouddn.com/';
        var src = url + result.key;
        var content = "![" + postImg.originalname + "](" + src + ")";
        //return img src to ajax
        res.json({content: content});
    });
});


module.exports = router;