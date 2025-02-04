const { Pool } = require("pg");
require('dotenv').config();

// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`
});
