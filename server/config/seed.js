const Category = require("../models/Category");

async function seedDefaultCategories() {
  try {
    console.log("Starting to seed categories...");

    const categories = [
      { name: "Food" },
      { name: "Transport" },
      { name: "Entertainment" },
      { name: "Housing" },
      { name: "Utilities" },
    ];

    const existing = await Category.find({ isCustom: false });

    if (existing.length === 0) {
      await Category.insertMany(categories);
      console.log("default categories seeded.");
    } else {
      console.log("default categories already exist. Skipping seeding...");
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}

module.exports = seedDefaultCategories;
