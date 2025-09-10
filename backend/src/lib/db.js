const { Pool } = require('pg');

let pool = null;

if (process.env.PG_CONNECTION_STRING) {
	pool = new Pool({
		connectionString: process.env.PG_CONNECTION_STRING,
		ssl: { rejectUnauthorized: false }
	});
}

module.exports = { pool };


