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
  
    get() {
      // Parse the array of strings stored in the database to ensure it's always an array
      const tagsString = this.getDataValue('tags');
      return tagsString ? tagsString.split(',') : [];
    },
    set(tagsArray) {
      // Join the array of strings into a comma-separated string before storing in the database
      this.setDataValue('tags', tagsArray.join(','));
    },
    }
  }
);



module.exports = blogPost;
