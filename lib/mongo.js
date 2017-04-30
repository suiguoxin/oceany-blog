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

exports.Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId},
    title: {type: 'string'},
    content: {type: 'string'},
    pv: {type: 'number'}
});
exports.Post.index({author: 1, _id: -1}).exec();