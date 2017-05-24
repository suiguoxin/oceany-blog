let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');
let CommentModel = require('../models/comments');
let MenuItemModel = require('../models/menuItems');

router.get('/', function (req, res) {
    let section = "openfoam";

    Promise.all([
        MenuItemModel.getMenuItemsBySection(section),
        PostModel.getPostsBySection(section)
    ])
        .then(function (result) {
            res.render(`${section}/index`, {
                menuItems: result[0],
                posts: result[1],
                section: section
            });
        });
});

router.get('/:postId', function (req, res) {
    let postId = req.params.postId;
    let section = "openfoam";

    Promise.all([
        MenuItemModel.getMenuItemsBySection(section),
        PostModel.getPostsBySection(section),
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ])
        .then(function (result) {
            res.render(`${section}/post`, {
                section: section,
                menuItems: result[0],
                posts: result[1],
                post: result[2],
                comments: result[3]
            });
        });
});

module.exports = router;