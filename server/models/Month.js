const { Schema, model } = require("mongoose");

const monthSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
      unique: false,
      validate: {
        validator: function (v) {
          return /^(0[1-9]|1[0-2])-\d{4}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid month format (MM-YYYY)!`,
      },
    },
    budget: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

monthSchema.index({ userId: 1, month: 1 }, { unique: true });

monthSchema.virtual("expenses", {
  ref: "Expense",
  localField: "_id",
  foreignField: "monthId",
  justOne: false,
});

monthSchema.set("toJSON", { virtuals: true });

const Month = model("Month", monthSchema);

module.exports = Month;
