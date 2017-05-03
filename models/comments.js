var Comment = require('../lib/mongo.js').Comment;
var marked = require('marked');

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
            .addCreatedAt()
            .exec();
    },
    getCommentsCount: function getCommentsCount(postId) {
        return Comment
            .count({postId: postId})
            .exec();
    }
};