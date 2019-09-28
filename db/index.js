const heroku = true;
let config = {
	client: 'sqlite3',
	connection: {
		filename: "./db/bni.sqlite"
	}
}

const knex = require('knex')(config);
module.exports = knex;
