let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');
let CommentModel = require('../models/comments');

router.get('/', function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    console.log("getting page " + page + "...");

    let section = "softwares";

    PostModel.getPostsCountBySection(section)
        .then(function (postsCount) {
            //pagesCount is of type float
            let pagesCount = postsCount / 5;
            let isFirstPage = (page - 1) === 0;
            let isLastPage = (page * 5) > postsCount;

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
    let postId = req.params.postId;

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            let post = result[0];
            let comments = result[1];
            res.render('softwares/post', {
                post: post,
                comments: comments
            });
        });
});

module.exports = router;