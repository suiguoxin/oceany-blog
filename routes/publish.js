var express = require('express');
var router = express.Router();

var multer = require('multer');
var memoryStorage = multer.memoryStorage();
var diskStorage = multer.diskStorage({
    destination: 'public/uploads/posts/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
var uploadMemory = multer({ storage: memoryStorage });
var uploadDisk = multer({ storage: diskStorage });

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    res.render('publish');
});

router.post('/', function (req, res) {
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
    console.log(req.file);

    var content = req.file.buffer.toString();
    console.log(content);

    res.json({content: content});
});

router.post('/uploadImg', uploadDisk.single('postImg'), function (req, res) {
    console.log(req.file);
    console.log(req.body);

    var avatar = req.file;
    var src = "uploads/posts/" + avatar.filename;

    //return img src to ajax
    res.json({src: src});
});


module.exports = router;