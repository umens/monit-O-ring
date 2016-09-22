var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// add method here
/*serverSchema.methods.findOneFromUrl = function (name) {

}*/

// create Schema
var UserSchema = mongoose.Schema({
	username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

// create model then export it
module.exports = mongoose.model('User', UserSchema);