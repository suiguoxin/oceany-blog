var config = require('config-lite');
const Mongolass = require('Mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.Users = mongolass.model('User',{
	email: {type:'string'},
	name: {type:'string'},
	password: {type:'string'},
});

exports.Users.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一