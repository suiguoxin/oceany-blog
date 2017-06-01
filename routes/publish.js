let express = require('express');
let router = express.Router();
//multer
let multer = require('multer');
let memoryStorage = multer.memoryStorage();
let uploadMemory = multer({storage: memoryStorage});
//qiniu
let qn = require('qn');
let client = qn.create({
    accessKey: 'IThkAny7wzlPGCR2pcJT8IrWkdes0Ic7PR38OwoQ',
    secretKey: '4lUiAwT3jymK85eFu85PboWTjuv6wLM8wMO8oCEs',
    bucket: 'oceany',
    origin: 'http://oceany.u.qiniudn.com',
    timeout: 3600000, // default rpc timeout: one hour
    uploadURL: 'http://up-z2.qiniu.com/' // the app outside of China
});

let PostModel = require('../models/posts');
let MenuItemModel = require('../models/menuItems');

router.get('/', function (req, res) {
    Promise.all([
        MenuItemModel.getMenuItemsBySection("openfoam"),
        MenuItemModel.getMenuItemsBySection("palabos"),
        MenuItemModel.getMenuItemsBySection("openlb"),
        MenuItemModel.getMenuItemsBySection("reef-3d"),
        MenuItemModel.getMenuItemsBySection("fluidty"),
        MenuItemModel.getMenuItemsBySection("nemoh"),
        MenuItemModel.getMenuItemsBySection("hos")
    ])
        .then(function (result) {
            res.render('publish', {
                menuItemsOpenfoam: result[0],
                menuItemsPalabos: result[1],
                menuItemsOpenlb: result[1]
            });
        });
});

router.post('/', function (req, res) {
    console.log("Pulishing the new post...");
    let author = req.session.user._id;
    let title = req.body.title;
    let section = req.body.section;
    let menuIndex = req.body.menuIndex;
    let index = req.body.index;
    let content = req.body.content;

    // 待写入数据库的用户信息
    let post = {
        author: author,
        title: title,
        section: section,
        menuIndex: menuIndex,
        index: index,
        content: content,
        pv: 0
    };

    PostModel.create(post)
        .then(function (result) {
            post = result.ops[0];
            req.flash('success', 'post-components succeed');
            res.redirect(`posts/${section}/${post._id}`)
        });
});

router.post('/uploadPost', uploadMemory.single('postFile'), function (req, res) {
    console.log("uploading post in router...");

    let content = req.file.buffer.toString();

    res.json({content: content});
});

router.post('/uploadImg', uploadMemory.single('postImg'), function (req, res) {
    console.log(req.file);

    let postImg = req.file;

    client.upload(postImg.buffer, {key: postImg.fieldname + '-' + Date.now()}, function (err, result) {
        let url = 'http://oq29i4a0h.bkt.clouddn.com/';
        let src = url + result.key;
        let content = "![" + postImg.originalname + "](" + src + ")";
        //return img src to ajax
        res.json({content: content});
    });
});

module.exports = router;