const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize'); // Import Sequelize
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sequelize configuration
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', // Change this to match your database dialect if not MySQL
  }
);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Include your Sequelize models and associations here
// For example, if you have models defined in separate files, import them and associate them with sequelize.

// Import your routes after defining Sequelize models and associations
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
