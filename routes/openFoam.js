var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

router.get('/', function (req, res) {
    res.render('openFoam/index', {});
});

router.get('/:number', function (req, res) {
    var number = req.params.number;
    var postId;
    if(number == 1.1){
        postId = "591223a96068db0c6c4fb8a9";
    } else postId = "591223f26068db0c6c4fb8aa";


    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            var post = result[0];
            var comments = result[1];
            res.render('openFoam/post', {
                post: post,
                comments: comments
            });
        });
});

module.exports = router;