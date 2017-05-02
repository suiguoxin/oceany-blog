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

router.get('/:postId/edit', function (req, res) {
    var postId = req.params.postId;
    var author = req.session.user._id;

        PostModel.getRawPostById(postId)
        .then(function (result) {
            var post = result;
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                post: post
            });
        });
});

router.post('/:postId/edit', function (req, res) {
    var postId = req.params.postId;
    var authorId = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    PostModel.updatePostById(postId,authorId,{title:title,content:content})
        .then(function () {
            req.flash('success', 'edit post succeed');
            res.redirect('/cfd/' + postId);
        });
});

module.exports = router;