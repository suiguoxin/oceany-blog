let express = require('express');
let router = express.Router();

let MenuItemModel = require('../models/menuItems');

router.get('/:section', function (req, res) {
    let section = req.params.section;

    MenuItemModel.getMenuItemsBySection(section)
        .then(function (menuItems) {
            res.render('menu/index', {
                section:section,
                menuItems: menuItems
            });
        });
});

router.post('/:section', function (req, res) {
    console.log("Creating the new menu item...");
    let section = req.body.section;
    let index = req.body.index;
    let title = req.body.title;

    // 待写入数据库的用户信息
    let menuItem = {
        section: section,
        index: index,
        title: title
    };

    MenuItemModel.create(menuItem)
        .then(function (result) {
            menuItem = result.ops[0];
            req.flash('success', 'menu items created');
            //如何在字符串中间使用变量？？
            res.redirect('back');
        })
        .catch(function (e) {
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', "Menu item already exist");
                return res.redirect('back');
            }
        });
});

module.exports = router;