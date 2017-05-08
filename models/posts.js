var Post = require('../lib/mongo.js').Post;
var CommentModel = require('../models/comments');
var marked = require('marked');

Post.plugin('addCommentsCount', {
    afterFind: function (posts) {
        return Promise.all(posts.map(function (post) {
            return CommentModel.getCommentsCount(post._id)
                .then(function (commentsCount) {
                    post.commentsCount = commentsCount;
                    return post;
                });
        }));
    },
    afterFindOne: function (post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id)
                .then(function (commentsCount) {
                    post.commentsCount = commentsCount;
                    return post
                });
        }
        return post;
    }
});

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
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },
    getPostById: function getPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPosts: function getPosts() {
        return Post
            .find()
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getFivePosts: function getFivePosts(page) {
        return Post
            .find()
            .skip(5 * (page - 1))
            .limit(5)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getSixPosts: function getSixPosts(page, callback) {
        return Post
            .find()
            .skip(5 * (page - 1))
            .limit(5)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPostsCount:function getPostsCount(){
      return Post
          .count({})
          .exec();
    },
    // 通过用户 id 和文章 id 更新一篇文章
    updatePostById: function updatePostById(postId, authorId, data) {
        return Post
            .update({author: authorId, _id: postId}, {$set: data})
            .exec();
    },
    // 通过用户 id 和文章 id 删除一篇文章
    deletePostById: function deletePostById(postId, authorId) {
        return Post
            .remove({author: authorId, _id: postId})
            .exec();
    },
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    }
};