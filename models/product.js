var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic'); 
//is a library which uses elastic search to replicate the data from mongoDb to elastic search so you can
//use mogoosastic feature later on without requiring us to write code to connect elsatic and mongoDb

var Schema = mongoose.Schema;
var ProductSchema = new Schema({
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	name: String,
	price: Number,
	image: String
});


//give ProductScheme tools so that it can use .search(),  .createMapping()
ProductSchema.plugin(mongoosastic, {
	hosts:[
		'localhost:9200'  //default port for elastic search
	]
});

module.exports = mongoose.model('Product', ProductSchema);