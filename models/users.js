var User = require('../lib/mongo.js').User;

module.exports = {
    create: function create(user) {
        return User.create(user).exec();
    },
    getUserByname: function getUserByName(name) {
        return User
            .findOne({name: name})
            .exec();
    },
    updateUserById: function updateUserById(userId, data) {
        return User
            .updateOne({_id: userId}, {$set: data})
            .exec();
    }
}
;