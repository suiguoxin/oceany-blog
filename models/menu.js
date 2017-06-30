let Menu = require('../lib/mongo.js').Menu;

module.exports = {
    create: function (menu) {
        return Menu
            .create(menu)
            .exec();
    },
    getMenuBySection: function (section) {
        return Menu
            .findOne({section: section})
            .exec();
    },
    addMenuItemBySection: function (section, item) {
        return Menu
            .update({section: section}, {$push: {items: item}})
            .exec();
    }
};