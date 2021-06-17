const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');

require('dotenv').config();

const User = require('./models/user');

app.use(cors())
app.use(express.static('public'));

//Set up default mongoose connection
const DB = process.env.DB;
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route('/api/users')
	.get(async function(req, res) {
		try {
			await User
				.find({})
				.select({ log:0, count: 0})
				.exec((err, data) => {
					if (err) throw 'No users exist';
					return data.length === 0 ? res.send('No users exist') : res.json(data);
				});
		} catch(err) {
			console.log(err);
			res.send(err);
		}
	})

	.post(async function(req, res) {
		let  { username }  = req.body
		try {
			if (!username) throw 'Path `username` is required.'

			const userExists = await User.exists({ username });
			if (userExists) throw 'Username already taken';

			const user = new User({ username });

			const data = await user.save();
			console.log(data);
			res.json({
				_id: data._id,
				username: data.username
			});
		} catch(err) {
			console.log(err);
			return (err.name === 'CastError') ? res.send(err.message) : res.send(err);
		}
	});

app.route('/api/users/:_id/exercises')
	.post(async function(req, res) {
		let { _id } = req.params;
		let { description, duration, date } = req.body;
		try {
			if (!_id) throw 'User not found';

			if (!description) throw 'Path `description` is required.';

			if (!duration) throw 'Path `duration` is required.'
		
			const exercise = (date === undefined || date === '') 
				? ({ description, duration, })
				: ({ description, duration, date })

			console.log(exercise)

			const userExercise = await User.findOneAndUpdate(
				{ _id },
				{
					$push: { "log": exercise },
					$inc: { count: 1 }
				},
				{ new: true }
			);

			if (userExercise === null) throw new Error();

			console.log(userExercise)
		} catch(err) {
			console.log(err);
			return err.name === 'CastError' ? res.send(err.message) : res.send(err)
		}
	})
	


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
