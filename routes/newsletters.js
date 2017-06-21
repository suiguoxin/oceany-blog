let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');
let CommentModel = require('../models/comments');

router.get('/', function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    console.log("getting page " + page + "...");

    let section = 'newsletters';
    const size = 4;

    PostModel.getPostsCountBySection(section)
        .then(function (postsCount) {
            //pagesCount is of type float
            let pagesCount = postsCount / size;
            let isFirstPage = (page - 1) === 0;
            let isLastPage = (page * size) > postsCount;

            PostModel.getPostsBySectionAndPage(page, size, section)
                .then(function (result) {
                    res.render('newsletters', {
                        section: section,
                        posts: result,
                        page: page,
                        isFirstPage: isFirstPage,
                        isLastPage: isLastPage,
                        pagesCount: pagesCount,
                        pageLink: '/newsletters?page='
                    });
                });
        });
});

router.get('/:postId', function (req, res) {
    let postId = req.params.postId;
    let section = 'newsletters';

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            let post = result[0];
            let comments = result[1];
            res.render(`${section}/post`, {
                section: section,
                post: post,
                comments: comments
            });
        });
});

module.exports = router;