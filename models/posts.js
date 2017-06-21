const Post = require('../lib/mongo.js').Post;
const CommentModel = require('../models/comments');
const marked = require('marked');

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
    getPostBySectionAndIndex: function (section, index) {
        return Post
            .findOne({section: section, index: index})
            .populate({path: 'author', model: 'User'})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPostsByPage: function (page, size) {
        return Post
            .find()
            .skip(size * (page - 1))
            .limit(size)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPostsByKeyword: function (page, size, keyword) {
        let pattern = new RegExp(keyword, "i");
        return Post
            .find({"title": pattern})
            .skip(size * (page - 1))
            .limit(size)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPostsCountByKeyword: function (keyword) {
        let pattern = new RegExp(keyword, "i");
        return Post
            .count({"title": pattern})
            .exec();
    },
    getPostsCount: function () {
        return Post
            .count({})
            .exec();
    },
    //firstly sort by id, then by index(if exist)
    getPostsBySection: function (section) {
        return Post
            .find({section: section})
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .sort({index: 1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPostsBySectionAndPage: function (page, size, section) {
        return Post
            .find({section: section})
            .skip(size * (page - 1))
            .limit(size)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .contentToHtml()
            .addCreatedAt()
            .addCommentsCount()
            .exec();
    },
    getPostsCountBySection: function getPostsCount(section) {
        return Post
            .count({section: section})
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