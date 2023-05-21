const Sequelize = require("sequelize");
const post = require("../model/blogPost");
const db = require("../util/db");

const userSchema = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName:true
  }
);

userSchema.sync({alter: true})
.then((message) => console.log(message, "data is ready..." ))
.catch((err) =>console.log(err));

userSchema.hasMany(post);


module.exports = userSchema;
