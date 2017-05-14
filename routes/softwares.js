var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

router.get('/', function (req, res) {
    var page = req.query.page ? req.query.page : 1;
    console.log("getting page " + page + "...");

    var section = "softwares";

    PostModel.getPostsCountBySection(section)
        .then(function (postsCount) {
            var postsCount = postsCount;
            //pagesCount is of type float
            var pagesCount = postsCount / 5;
            var isFirstPage = (page - 1) === 0;
            var isLastPage = (page * 5) > postsCount;

            PostModel.getFivePostsBySection(page, section)
                .then(function (result) {
                    res.render('softwares/index', {
                        section:'softwares',
                        posts: result,
                        page: page,
                        isFirstPage: isFirstPage,
                        isLastPage: isLastPage,
                        pagesCount: pagesCount
                    });
                });
        });
});

router.get('/:postId', function (req, res) {
    var postId = req.params.postId;

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            var post = result[0];
            var comments = result[1];
            res.render('softwares/post', {
                post: post,
                comments: comments
            });
        });
});

module.exports = router;