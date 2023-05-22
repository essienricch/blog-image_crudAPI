const Sequelize = require("sequelize");
const db = require("../util/db");
const User = require("./blogUser")

const blogScheme = db.define(
  "post",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    body: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    file: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName:true
  }
);

// blogScheme.belongsTo(User, { foreignKey: 'userId' })
blogScheme.sync({alter:true});

module.exports = blogScheme;
