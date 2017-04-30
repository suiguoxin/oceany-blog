var Post = require('../lib/mongo.js').Post;

module.exports = {
    create: function create(post) {
        return Post
            .create(post)
            .exec();
    },
    getPostById: function getPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },
    getPosts: function getPosts() {
        return Post
            .find()
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .exec();
    },
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    }
};