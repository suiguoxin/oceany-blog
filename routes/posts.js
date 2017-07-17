let express = require('express');
let router = express.Router();

//config
let config = require("config-lite")(__dirname);

let PostModel = require('../models/posts');
let CommentModel = require('../models/comments');
let MenuModel = require('../models/menu');

//multer
let multer = require('multer');
let memoryStorage = multer.memoryStorage();
let uploadMemory = multer({storage: memoryStorage});

//qiniu
let qn = require('qn');
let client = qn.create({
    accessKey: config.qn.accessKey,
    secretKey: config.qn.secretKey,
    bucket: config.qn.bucket,
    origin: config.qn.origin,
    timeout: config.qn.timeout,
    uploadURL: config.qn.uploadURL
});

let checkLogin = require('../middlewares/check').checkLogin;

router.get('/create', checkLogin, function (req, res) {
    res.render('posts/create', {});
});

//for ajax use
router.get('/create/getMenuIndex/:section', function (req, res) {
    let section = req.params.section;

    MenuModel.getMenuBySection(section)
        .then(function (menu) {
            res.render('posts-components/menuIndex', {
                menuItems: menu.items
            }, function (err, html) {
                res.send(html);
            })
        })
});

//for ajax use
router.post('/create/uploadPost', uploadMemory.single('postFile'), function (req, res) {
    console.log("uploading post in router...");

    let content = req.file.buffer.toString();

    res.json({content: content});
});

//for ajax use
router.post('/create/uploadImg', uploadMemory.single('postImg'), function (req, res) {
    console.log(req.file);

    let postImg = req.file;
    let format = req.body.format;

    client.upload(postImg.buffer, {key: postImg.fieldname + '-' + Date.now()}, function (err, result) {
        let cdn = config.qn.cdn;
        let src = cdn + result.key;
        let content;
        if (format === 'md') {
            content = "![" + postImg.originalname + "](" + src + ")";
        } else content = src;

        //return img src to ajax
        res.json({content: content});
    });
});

router.post('/create', checkLogin, function (req, res) {
    let author = req.session.user._id;
    let title = req.body.title;
    let section = req.body.section;
    let menuIndex = req.body.menuIndex || '';
    let index = req.body.index || '';
    let content = req.body.content;
    let poster = req.body.poster || '';

    console.log(`poster: ${poster}`);

    // 待写入数据库的用户信息
    let post = {
        author: author,
        title: title,
        section: section,
        poster: poster,
        menuIndex: menuIndex,
        index: index,
        content: content,
        pv: 0
    };

    PostModel.create(post)
        .then(function (result) {
            post = result.ops[0];
            req.flash('success', 'post succeed');
            if (section === 'newsletters') {
                res.redirect('/newsletters');
                return;
            }
            res.redirect(`/posts/${section}/${post._id}`)
        });
});

router.get('/archive', function (req, res) {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    console.log("getting page " + page + "...");

    const size = 8;

    PostModel.getPostsCount()
        .then(function (postsCount) {
            //pagesCount is of type float
            let pagesCount = postsCount / size;
            let isFirstPage = (page - 1) === 0;
            let isLastPage = (page * size) > postsCount;

            PostModel.getPostsByPage(page, size)
                .then(function (result) {
                    res.render('posts/archive', {
                        posts: result,
                        page: page,
                        isFirstPage: isFirstPage,
                        isLastPage: isLastPage,
                        pagesCount: pagesCount,
                        pageLink: '/posts/archive?page='
                    });
                });
        });
});

router.get('/search', function (req, res) {
    let keyword = req.query.keyword;
    let page = req.query.page ? req.query.page : 1;
    console.log("getting page " + page + "...");

    const size = 8;

    PostModel.getPostsCountByKeyword(keyword)
        .then(function (postsCount) {
            //pagesCount is of type float
            let pagesCount = postsCount / size;
            let isFirstPage = (page - 1) === 0;
            let isLastPage = (page * size) > postsCount;

            PostModel.getPostsByKeyword(page, size, keyword)
                .then(function (result) {
                    res.render('posts/archive', {
                        keyword: keyword,
                        posts: result,
                        page: page,
                        isFirstPage: isFirstPage,
                        isLastPage: isLastPage,
                        pagesCount: pagesCount,
                        pageLink: `/posts/search?keyword=${keyword}&page=`
                    });
                });
        });
});

router.get('/:section', function (req, res) {
    let section = req.params.section;

    if (section === 'newsletters') {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        console.log("getting page " + page + "...");

        const size = 3;

        PostModel.getPostsCountBySection(section)
            .then(function (postsCount) {
                //pagesCount is of type float
                let pagesCount = postsCount / size;
                let isFirstPage = (page === 1);
                let isLastPage = (page * size) >= postsCount;

                PostModel.getPostsBySectionAndPage(page, size, section)
                    .then(function (result) {
                        res.render('posts/newsletters/index', {
                            section: section,
                            posts: result,
                            page: page,
                            isFirstPage: isFirstPage,
                            isLastPage: isLastPage,
                            pagesCount: pagesCount,
                            pageLink: '/posts/newsletters?page='
                        });
                    });
            });
    } else {
        Promise.all([
            MenuModel.getMenuBySection(section),
            PostModel.getPostsBySection(section),
            PostModel.getPostBySectionAndIndex(section, '0') //introduction
        ])
            .then(function (result) {
                res.render(`posts/index`, {
                    section: section,
                    menuItems: result[0].items,
                    posts: result[1],
                    post: result[2]
                });
            });
    }
});

router.get('/:section/:postId', function (req, res) {
    let section = req.params.section;
    let postId = req.params.postId;

    if (section === 'newsletters') {
        Promise.all([
            PostModel.getPostById(postId),
            CommentModel.getComments(postId),
            PostModel.incPv(postId)
        ])
            .then(function (result) {
                let post = result[0];
                let comments = result[1];
                res.render(`posts/${section}/post`, {
                    section: section,
                    post: post,
                    comments: comments
                });
            });
    } else {
        Promise.all([
            MenuModel.getMenuBySection(section),
            PostModel.getPostsBySection(section),
            PostModel.getPostById(postId),
            CommentModel.getComments(postId),
            PostModel.incPv(postId)
        ])
            .then(function (result) {
                res.render('posts/post', {
                    section: section,
                    menuItems: result[0].items,
                    posts: result[1],
                    post: result[2],
                    comments: result[3]
                });
            });
    }
});

router.get('/:section/:postId/edit', checkLogin, function (req, res) {
    let postId = req.params.postId;
    let author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function (result) {
            let post = result;
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('posts/edit', {
                post: post
            });
        });
});

router.post('/:section/:postId/edit', function (req, res) {
    let section = req.params.section;
    let menuIndex = req.body.menuIndex || '';
    let index = req.body.index || '';
    let postId = req.params.postId;
    let authorId = req.session.user._id;
    let title = req.body.title;
    let content = req.body.content;
    let poster = req.body.poster || '';

    // 待写入数据库的用户信息
    let post = {
        menuIndex: menuIndex,
        index: index,
        title: title,
        poster: poster,
        content: content
    };

    PostModel.updatePostById(postId, authorId, post)
        .then(function () {
            req.flash('success', 'edit post succeed');
            res.redirect(`/posts/${section}/${postId}`);
        });
});

router.get('/:section/:postId/delete', function (req, res) {
    let section = req.params.section;
    let postId = req.params.postId;
    let authorId = req.session.user._id;

    //code to verify if author == user

    PostModel.deletePostById(postId, authorId)
        .then(function () {
            CommentModel.deleteCommentsByPostId(postId);
            req.flash('success', 'delete post succeed');

            res.redirect(`/posts/${section}`);
        });
});

router.post('/:section/:postId/comment', function (req, res) {
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
            req.flash('success', 'post comment succeed');
            res.redirect('back');
        });
});

router.get('/:section/:postId/comments/:commentId/delete', function (req, res) {
    let commentId = req.params.commentId;
    let authorId = req.session.user._id;

    CommentModel.deleteCommentById(commentId, authorId)
        .then(function () {
            req.flash('success', 'delete comment succeed');
            res.redirect('back');
        });
});

module.exports = router;