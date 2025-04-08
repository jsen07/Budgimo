const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
    set: function (value) {
      return parseFloat(value).toFixed(2);
    },
  },
  date: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthId: {
    type: Schema.Types.ObjectId,
    ref: "Month",
    required: true,
  },
});

expenseSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

expenseSchema.virtual("month", {
  ref: "Month",
  localField: "monthId",
  foreignField: "_id",
  justOne: true,
});

expenseSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

expenseSchema.set("toJSON", { virtuals: true });

const Expense = model("Expense", expenseSchema);

module.exports = Expense;
