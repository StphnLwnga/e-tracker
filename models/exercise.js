const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: { type: Date, default: Date.now }
});

module.exports.exerciseSchema = exerciseSchema;

module.exports.Exercise = mongoose.model('exercise', exerciseSchema);