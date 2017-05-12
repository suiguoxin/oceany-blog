var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});

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

router.post('/uploadPost', upload.single('postFile'), function (req, res) {
    console.log("uploading post in router...");
    console.log(req.file);
    console.log(req.body);

    //res.send('Upload Done !');
    return req.file.buffer;
});


module.exports = router;