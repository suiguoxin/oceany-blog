var MenuItem = require('../lib/mongo.js').MenuItem;

module.exports = {
    create: function create(menuItem) {
        return MenuItem.create(menuItem).exec();
    },
    getMenuItemsBySection: function getMenuItemsBySection(section) {
        return MenuItem
            .find({section: section})
            .exec();
    }
}
;