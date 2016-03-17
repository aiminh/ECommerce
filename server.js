var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session); //for saving session in mongo db
var secret = require('./config/secret');
var passport = require('passport');
var User = require('./models/user');
var Category = require('./models/category');
var cartLength = require('./middlewares/middlewares');

var app = express();

mongoose.connect(secret.database, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to DB');
	}
});

//middleware
app.use(morgan('dev')); //allow to log each request
app.use(bodyParser.json()); //now our express app can parse json format data
app.use(bodyParser.urlencoded({
	extended: true
})); // now can parse x-www-form-urlencoded
app.engine('ejs', engine); //use ejs template for displaying data in view
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //tell express the folder is for static files

app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({
		url: secret.database,
		autoConnect: true
	})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});

app.use(cartLength);

app.use(function(req, res, next){
	Category.find({}, function(err, categories){
		if (err) return next(err);
		res.locals.categories = categories;
		next();
	});
});



var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);



app.listen(secret.port, function(err) {
	if (err) throw err;
	console.log('Server is running on port :' + secret.port);
});