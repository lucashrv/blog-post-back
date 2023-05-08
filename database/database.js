require('dotenv').config();
const Sequelize = require('sequelize')

const connection = new Sequelize(
    process.env.DATABASE_DB,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASS,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)

module.exports = connection