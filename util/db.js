require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
  { freezeTableName: true }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully... ");
  })
  .catch((error) => {
    console.log("Unable to connect to the database:", error);
  });

module.exports = sequelize;
