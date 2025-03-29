const mongoose = require("mongoose");
require('dotenv').config();

// const mongoDB_uri_password = process.env.MONGODB_URI_PASSWORD

mongoose
  .connect(`mongodb+srv://vaynecaitlyn:czit82EAE4gRrg5l@budgetbuddy-development.xifnuuw.mongodb.net/?retryWrites=true&w=majority&appName=BudgetBuddy-Development`)
  .then(() => {
    console.log("Connected to the database yay");
  })
  .catch((error) => {
    console.log(`Mongoose error: ${error}`);
  });

module.exports = mongoose.connection;