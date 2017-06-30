var config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var objectIdToTimestamp = require('objectid-to-timestamp');
var moment = require('moment');

mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        return results.map(function (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
            return result;
        });
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

exports.User = mongolass.model('User', {
    name: {type: 'string'},
    email: {type: 'string'},
    authority: {type: 'string'},
    bio: {type: 'string'},
    avatar: {type: 'string'}
});

exports.LocalAuth = mongolass.model('LocalAuth', {
    user_id: {type: Mongolass.Types.ObjectId},
    username: {type: 'string'},
    password: {type: 'string'}
});
exports.LocalAuth.index({username: 1}, {unique: true}).exec();// username全局唯一

exports.Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId},
    title: {type: 'string'},
    section: {type: 'string'},
    poster: {type: 'string'},
    menuIndex: {type: 'string'},
    index: {type: 'string'},
    content: {type: 'string'},
    pv: {type: 'number'}
});
//作用于数据库？还是model 为什么_id：－1不生效
exports.Post.index({author: 1, _id: -1}).exec();

exports.Comment = mongolass.model('Comment', {
    author: {type: Mongolass.Types.ObjectId},
    content: {type: 'string'},
    postId: {type: Mongolass.Types.ObjectId}
});
exports.Comment.index({postId: 1, _id: 1}).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
//index 到底什么作用？？
exports.Comment.index({author: 1, _id: 1}).exec();// 通过用户 id 和留言 id 删除一个留言

exports.Menu = mongolass.model('Menu', {
    section: {type: String},
    items: [
        {
            index: {type: 'number'},
            title: {type: 'string'}
        }
    ]
});
exports.Menu.index({section: 1}, {unique: true}).exec();