const { Sequelize } = require("sequelize");
const Post = require("../model/blogPost");
const db = require("../util/db");


const userSchema = db.define(
  'user',
  {
   
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },

);



userSchema.hasMany(Post, {foreignKey: 'userId', onDelete: 'CASCADE'});
Post.belongsTo(userSchema, { foreignKey: "userId" })

 

module.exports = userSchema;
