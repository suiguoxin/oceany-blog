let User = require('../lib/mongo.js').User;

module.exports = {
    create: function (user) {
        return User.create(user).exec();
    },
    updateUserById: function (userId, data) {
        return User
            .updateOne({_id: userId}, {$set: data})
            .exec();
    }
}
;