var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    PostModel.getPosts()
        .then(function (result) {
            res.render('cfd/index', {
                posts: result
            });
        })
});

router.get('/:postId', function (req, res) {
    var postId = req.params.postId;

    //promise 什么意思？？
    Promise.all([
        PostModel.getPostById(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            var post = result[0];
            res.render('cfd/post', {
                post: post
            });
        });
});

module.exports = router;