var config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
    email: {type: 'string'},
    name: {type: 'string'},
    password: {type: 'string'},
});

exports.User.index({name: 1}, {unique: true}).exec();// 根据用户名找到用户，用户名全局唯一