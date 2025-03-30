const mongoose = require('mongoose');

// Category Schema for mongoDB
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isCustom: { type: Boolean, default: false },
  });
  
  const Category = mongoose.model("Category", categorySchema);
  
  module.exports = Category;