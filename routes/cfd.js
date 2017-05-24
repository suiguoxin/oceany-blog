let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');
let CommentModel = require('../models/comments');
let MenuItemModel = require('../models/menuItems');

router.get('/', function (req, res) {
    let section = "cfd";

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
    let section = "cfd";

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

router.get('/:postId/edit', function (req, res) {
    let postId = req.params.postId;
    let author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function (result) {
            let post = result;
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                post: post
            });
        });
});

router.post('/:postId/edit', function (req, res) {
    let postId = req.params.postId;
    let authorId = req.session.user._id;
    let title = req.body.title;
    let content = req.body.content;

    PostModel.updatePostById(postId, authorId, {title: title, content: content})
        .then(function () {
            req.flash('success', 'edit post-components succeed');
            res.redirect('/cfd/' + postId);
        });
});

router.get('/:postId/delete', function (req, res) {
    let postId = req.params.postId;
    let authorId = req.session.user._id;

    //code to verify if author == user

    PostModel.deletePostById(postId, authorId)
        .then(function () {
            CommentModel.deleteCommentsByPostId(postId);
            req.flash('success', 'delete post-components succeed');
            res.redirect('/cfd');
        });
});

router.post('/:postId/comment', function (req, res) {
    let postId = req.params.postId;
    let authorId = req.session.user._id;
    let content = req.body.content;

    let comment = {
        author: authorId,
        content: content,
        postId: postId
    };

    CommentModel.create(comment)
        .then(function () {
            req.flash('success', 'post-components comment succeed');
            res.redirect('back');
        });
});

router.get('/:postId/comments/:commentId/delete', function (req, res) {
    let commentId = req.params.commentId;
    let authorId = req.session.user._id;

    CommentModel.deleteCommentById(commentId, authorId)
        .then(function () {
            req.flash('success', 'delete comment succeed');
            res.redirect('back');
        });
});
module.exports = router;