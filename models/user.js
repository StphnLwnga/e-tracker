const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const exerciseSchema = require('./exercise').exerciseSchema;

const userSchema = new Schema({
	username: { type: String, required: true },
	count: { type: Number, default: 0 },
	log: [exerciseSchema]
});

const User = mongoose.model('user', userSchema);

module.exports = User;