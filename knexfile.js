// Database connection
require('dotenv').config()
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: '5432',
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: 'forex_checkr'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: '__migrations__',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
}
