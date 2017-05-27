let express = require('express');
let router = express.Router();

let PostModel = require('../models/posts');
let MenuItemModel = require('../models/menuItems');

router.get('/:section', function (req, res) {
    let section = req.params.section;

    Promise.all([
        MenuItemModel.getMenuItemsBySection(section),
        PostModel.getPostsBySection(section)
    ])
        .then(function (result) {
            res.render(`books/index`, {
                section: section,
                menuItems: result[0],
                posts: result[1]
            });
        });
});

module.exports = router;