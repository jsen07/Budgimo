const { Schema, model } = require("mongoose");

const recurringPaymentSchema = new Schema(
  {
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
      type: Number,
      required: true,
      min: [1, "Choose a day of a month!"],
      max: [31, "There are only a maximum 31 days in month!"], // DAY OF MONTH
    },
    frequence: {
      type: String, // WEEKLY || MONTHLY || ANNUALLY
      enum: {
        values: ["Weekly", "Monthly", "Annual"],
        message: 'Frequence must be either "Weekly", "Monthly", "Annual"',
      },
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

recurringPaymentSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const RecurringPayment = model("RecurringPayment", recurringPaymentSchema);

module.exports = RecurringPayment;
