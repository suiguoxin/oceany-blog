let express = require('express');
let router = express.Router();

let MenuModel = require('../models/menu');
let checkLogin = require('../middlewares/check').checkLogin;

router.get('/:section', checkLogin, function (req, res) {
    let section = req.params.section;

    MenuModel.getMenuBySection(section)
        .then(function (menu) {
            res.render('menu/index', {
                section:section,
                menuItems: menu.items
            });
        });
});

router.post('/:section', checkLogin, function (req, res) {
    console.log("Creating the new menu item...");
    let section = req.body.section;
    let index = parseInt(req.body.index);
    let title = req.body.title;

    // 待写入数据库的用户信息
    let menuItem = {
        section: section,
        index: index,
        title: title
    };

    MenuModel.addMenuItemBySection(section, menuItem)
        .then(function (result) {
            // menuItem = result.ops[0];
            req.flash('success', 'menu items created');
            res.redirect('back');
        })
        .catch(function (e) {
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', "Menu item already exist");
                return res.redirect('back');
            } else {
                req.flash('error', e.message);
                return res.redirect('back');
            }
        });
});

module.exports = router;