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
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value) {
          const frequence = this.frequence;
          const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          if (frequence === "Weekly") {
            return typeof value === "string" && weekdays.includes(value);
          } else if (frequence === "Monthly") {
            const numericValue = parseInt(value, 10);
            return (
              typeof numericValue === "number" &&
              numericValue >= 1 &&
              numericValue <= 31
            );
          } else if (frequence === "Annual") {
            // Match MM-DD format
            const regex =
              /^(?:(?:01|03|05|07|08|10|12)-(0[1-9]|[12][0-9]|3[01])|(?:04|06|09|11)-(0[1-9]|[12][0-9]|30)|02-(0[1-9]|1[0-9]|2[0-9]))$/;
            return typeof value === "string" && regex.test(value);
          }

          return false;
        },
        message: "Invalid date format for the selected frequency.",
      },
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
