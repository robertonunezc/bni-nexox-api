const heroku = true;
let config = {
	client: 'sqlite3',
	connection: {
		filename: "./db/bni.sqlite"
	},
	useNullAsDefault: true
}

const knex = require('knex')(config);
module.exports = knex;
