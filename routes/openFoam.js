var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

router.get('/', function (req, res) {
    res.render('openFoam/index', {});
});

router.get('/:index', function (req, res) {
    var index = req.params.index;

    PostModel.getPostBySectionAndIndex("OpenFoam", index)
        .then(function (result) {
            if (!result) {
                req.flash('error', 'This post does not exist');
                res.redirect('back');
                return;
            }
            var post = result;
            var postId = post._id;
            Promise.all([
                CommentModel.getComments(postId),
                PostModel.incPv(postId)
            ])
                .then(function (result) {
                    var comments = result[0];
                    res.render('openFoam/post', {
                        post: post,
                        comments: comments
                    });
                });
        });
    // Promise.all([
    //     PostModel.getPostById(postId),
    //     CommentModel.getComments(postId),
    //     PostModel.incPv(postId)
    // ])
    //     .then(function (result) {
    //         var post = result[0];
    //         var comments = result[1];
    //         res.render('openFoam/post', {
    //             post: post,
    //             comments: comments
    //         });
    //     });
});

module.exports = router;