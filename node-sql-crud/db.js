const { Sequelize } = require("sequelize");

// Connect to MySQL database
const sequelize = new Sequelize("nodecrud", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize.authenticate()
  .then(() => console.log("MySQL connected"))
  .catch(err => console.log("Error: " + err));

module.exports = sequelize;
