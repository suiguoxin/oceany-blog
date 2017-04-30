var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    res.render('post');
});

router.post('/', function (req, res) {
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    // 待写入数据库的用户信息
    var post = {
        author:author,
        title: title,
        content: content
    };

    PostModel.create(post)
        .then(function (result) {
            req.flash('success', 'post succeed');
            res.redirect('cfd');
        });
});

module.exports = router;