var LocalAuth = require('../lib/mongo.js').LocalAuth;

module.exports = {
    create: function create(localAuth) {
        return LocalAuth.create(localAuth).exec();
    },
    getLocalAuthByUsername: function (username) {
        return LocalAuth
            .findOne({username: username})
            .populate({path: 'user_id', model: 'User'})
            .exec();
    },
}
;