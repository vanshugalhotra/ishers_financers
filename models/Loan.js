const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new Schema(
  {
    loanNo: {
      type: String,
      required: true,
      unique: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client", // Reference to the Client model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Loan", loanSchema);
