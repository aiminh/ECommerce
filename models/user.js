var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var Schema = mongoose.Schema;

//the user schema attributes

var UserSchema = Schema({

	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: String,
	profile: {
		name: {
			type: String,
			default: ''
		},
		picture: {
			type: String,
			default: ''
		}
	},
	address: String,
	history: [{
		paid: {
			type: Number,
			default: 0
		},
		item: {
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	}]
});


//hash the password before we save it to db

UserSchema.pre('save', function(next) { //built in method 'pre' in mogoose
	var user = this;
	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next();
			user.password = hash;
			next();
		});
	});

});



//compare password in db and the one user type in 
UserSchema.methods.comparePassword = function(password) { //custom method
	return bcrypt.compareSync(password, this.password);
};

//custom function for user obj, will return a image based on email
UserSchema.methods.gravatar = function(size) {
	if (!this.size) size = 200; //default size
	if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro'; //if no email. then return random image
	var md5 = crypto.createHash('md5').update(this.email).digest('hex'); //encrypt email

	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro'; //return unique image for specific email user
}


module.exports = mongoose.model('User', UserSchema);