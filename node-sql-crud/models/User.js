const { DataTypes } = require("sequelize");
// const sequelize = require("/node-sql-crud/db");
const sequelize = require("../db");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  age: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = User;
// C:\Users\DEV-2\node-js-dhruvi\node-sql-crud\db.js