var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

router.get('/', function (req, res) {

    var section = "CFD";
    PostModel.getPostsBySection(section)
        .then(function (result) {
            res.render('cfd/index', {
                posts: result
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
            res.render('cfd/post', {
                post: post,
                comments: comments
            });
        });
});

router.get('/:postId/edit', function (req, res) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function (result) {
            var post = result;
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                post: post
            });
        });
});

router.post('/:postId/edit', function (req, res) {
    var postId = req.params.postId;
    var authorId = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    PostModel.updatePostById(postId, authorId, {title: title, content: content})
        .then(function () {
            req.flash('success', 'edit post-components succeed');
            res.redirect('/cfd/' + postId);
        });
});

router.get('/:postId/delete', function (req, res) {
    var postId = req.params.postId;
    var authorId = req.session.user._id;

    //code to verify if author == user

    PostModel.deletePostById(postId, authorId)
        .then(function () {
            CommentModel.deleteCommentsByPostId(postId);
            req.flash('success', 'delete post-components succeed');
            res.redirect('/cfd');
        });
});

router.post('/:postId/comment', function (req, res) {
    var postId = req.params.postId;
    var authorId = req.session.user._id;
    var content = req.body.content;

    var comment = {
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
    var commentId = req.params.commentId;
    var authorId = req.session.user._id;

    CommentModel.deleteCommentById(commentId, authorId)
        .then(function () {
            req.flash('success', 'delete comment succeed');
            res.redirect('back');
        });
});
module.exports = router;