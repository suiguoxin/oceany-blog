var express = require('express');
var router = express.Router();

var MenuItemModel = require('../models/menuItems');

router.get('/', function (req, res) {
    res.render('menu', {});
});

router.get('/edit/:section', function (req, res) {
    var section = req.params.section;

    console.log(section);

    MenuItemModel.getMenuItemsBySection(section)
        .then(function (menuItems) {
            res.render('menu/edit', {
                menuItems:menuItems
            });
        });
});

router.post('/', function (req, res) {
    console.log("Creating the new menu item...");
    var section = req.body.section;
    var index = req.body.index;
    var title = req.body.title;

    // 待写入数据库的用户信息
    var menuItem = {
        section: section,
        index: index,
        title:title
    };

    MenuItemModel.create(menuItem)
        .then(function (result) {
            menuItem = result.ops[0];
            req.flash('success', 'menu items created');
            //如何在字符串中间使用变量？？
            res.redirect('/'+section);
        });
});

router.post('/edit/:section', function (req, res) {
    console.log("Creating the new menu item...");
    var section = req.body.section;
    var index = req.body.index;
    var title = req.body.title;

    // 待写入数据库的用户信息
    var menuItem = {
        section: section,
        index: index,
        title:title
    };

    MenuItemModel.create(menuItem)
        .then(function (result) {
            menuItem = result.ops[0];
            req.flash('success', 'menu items created');
            //如何在字符串中间使用变量？？
            res.redirect('back');
        });
});

module.exports = router;