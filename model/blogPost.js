const {DataTypes, Sequelize} = require("sequelize");
const db = require("../util/db");


const blogPost = db.define(
  "post",
  {

    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    file: {
      type: Sequelize.STRING,
    },

    tags:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    }
  }
);



module.exports = blogPost;
