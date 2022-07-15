var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
});

const user = (module.exports = mongoose.model('user', userSchema));

module.exports.get = function (callback, limit) {
  user.find(callback).limit(limit);
}
