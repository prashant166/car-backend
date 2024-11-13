const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST_URL,
  dialect: process.env.DB_DIALECT, // Ensure this is specified, e.g., 'postgres', 'mysql', etc.
});

module.exports = sequelize;
