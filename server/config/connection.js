const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB_uri = process.env.MONGODB_URI;

mongoose
  .connect(mongoDB_uri)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log(`Mongoose error: ${error}`);
  });

module.exports = mongoose.connection;
