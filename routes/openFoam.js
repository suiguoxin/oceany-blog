var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

router.get('/', function (req, res) {
    var section = "OpenFoam";
    PostModel.getPostsBySection(section)
        .then(function (result) {
            res.render('openFoam/index', {
                posts: result,
                section: "openFoam"
            });
        });
});

router.get('/:postId', function (req, res) {
    var postId = req.params.postId;

    PostModel.getPostsBySection("OpenFoam")
        .then(function (result) {
            var posts = result;
            Promise.all([
                PostModel.getPostById(postId),
                CommentModel.getComments(postId),
                PostModel.incPv(postId)
            ])
                .then(function (result) {
                    var post = result[0];
                    var comments = result[1];
                    res.render('openFoam/post', {
                        posts: posts,
                        post: post,
                        comments: comments
                    });
                });
        });
});

module.exports = router;