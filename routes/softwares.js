var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

router.get('/', function (req, res) {
    var page = req.query.page ? req.query.page : 1;
    console.log("getting page " + page + "...");

    PostModel.getFivePosts(page)
        .then(function (result) {
            res.render('softwares/index', {
                posts: result,
                page: page
            });
        });

    // PostModel.getSixPosts(page, function (err, posts, postsCount) {
    //         console.log(postsCount);
    //         res.render('cfd/index', {
    //             posts: result,
    //             page: page
    //         });
    //     }
    // );
});

module.exports = router;