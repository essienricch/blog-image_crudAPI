const Sequelize = require('sequelize');
require('dotenv').config()


const sequelize = new Sequelize({
   
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
    host: process.env.DB_HOST,
    dialect: 'postgres',
    }
);



module.exports = sequelize;