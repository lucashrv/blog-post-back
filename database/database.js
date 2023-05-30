require('dotenv').config();
const Sequelize = require('sequelize')

const connection = new Sequelize(
    process.env.DATABASE_DB,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASS,
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00',
        logging: false
    }
)

module.exports = connection