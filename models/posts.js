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
    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .exec();
    },
    getPostById: function getPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .contentToHtml()
            .addCreatedAt()
            .exec();
    },
    getPosts: function getPosts() {
        return Post
            .find()
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .exec();
    },
    // 通过用户 id 和文章 id 更新一篇文章
    updatePostById: function updatePostById(postId, authorId, data) {
        return Post.update({ author: authorId, _id: postId }, { $set: data }).exec();
    },
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    }
};