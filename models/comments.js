const Comment = require('../lib/mongo.js').Comment;
const marked = require('marked');

//plugin 关键词是什么意思
Comment.plugin('commentToHtml', {
    afterFind: function (comments) {
        return comments.map(function (comment) {
            comment.content = marked(comment.content);
            return comment;
        });
    },
    afterFindOne: function (comment) {
        if (comment) {
            comment.content = marked(comment.content);
        }
        return comment;
    }
});

module.exports = {
    create: function create(comment) {
        return Comment
            .create(comment)
            .exec();
    },
    getComments: function getComments(postId) {
        return Comment
            .find({postId: postId})
            .populate({path: 'author', model: 'User'})
            .sort({_id: 1})
            .commentToHtml()
            .addCreatedAt()
            .exec();
    },
    getCommentsCount: function getCommentsCount(postId) {
        return Comment
            .count({postId: postId})
            .exec();
    },
    // 通过用户 id 和留言 id 删除一个留言
    deleteCommentById: function deleteCommentById(commentId, author) {
        return Comment
            .remove({ author: author, _id: commentId })
            .exec();
    },
    deleteCommentsByPostId:function deleteCommentsByPostId(postId) {
        return Comment
            .remove({postId:postId})
            .exec();
    }
};