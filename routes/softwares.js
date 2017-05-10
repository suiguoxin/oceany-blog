var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    var page = req.query.page ? req.query.page : 1;
    console.log("getting page " + page + "...");

    var section = "Softwares";

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
                        posts: result,
                        page: page,
                        isFirstPage: isFirstPage,
                        isLastPage: isLastPage,
                        pagesCount: pagesCount
                    });
                });
        });
});

module.exports = router;