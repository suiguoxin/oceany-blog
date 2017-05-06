var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    res.render('publish');
});

router.post('/', function (req, res) {
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    // 待写入数据库的用户信息
    var post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    PostModel.create(post)
        .then(function (result) {
            post = result.ops[0];
            req.flash('success', 'post-components succeed');
            //如何在字符串中间使用变量？？
            res.redirect('/cfd/' + post._id);
        });
});

module.exports = router;