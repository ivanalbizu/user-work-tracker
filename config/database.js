const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
)
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.catch(err => {
		console.log(err)
	});

module.exports = mongoose