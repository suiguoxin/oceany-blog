var Post = require('../lib/mongo.js').Post;
var marked = require('marked');

//plugin 关键词是什么意思
Post.plugin('contentToHtml', {
    afterFind: function (posts) {
        return posts.map(function (post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function (post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

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
            .contentToHtml()
            .exec();
    },
    getPosts: function getPosts() {
        return Post
            .find()
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .exec();
    },
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    }
};