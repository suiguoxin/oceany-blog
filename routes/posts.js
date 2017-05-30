let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');
let CommentModel = require('../models/comments');
let MenuItemModel = require('../models/menuItems');

router.get('/:section', function (req, res) {
    let section = req.params.section;

    Promise.all([
        MenuItemModel.getMenuItemsBySection(section),
        PostModel.getPostsBySection(section)
    ])
        .then(function (result) {
            res.render(`posts/index`, {
                section: section,
                menuItems: result[0],
                posts: result[1]
            });
        });
});

router.get('/:section/:postId', function (req, res) {
    let postId = req.params.postId;

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            res.render('posts/content', {
                post: result[0],
                comments: result[1]
            }, function (err, html) {
                res.send(html);
            });
        });
});

module.exports = router;