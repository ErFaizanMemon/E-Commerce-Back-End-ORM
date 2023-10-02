const express = require('express');
const routes = require('./routes');
require("dotenv").config({ path: "./TEMPLATE"} );
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

// const expressSanitizer = require("express-sanitizer");
// const router = require("./Routes/router");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
