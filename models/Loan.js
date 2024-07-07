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
    type: {
      type: String,
      default: "Personal",
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

// Check if the model already exists before creating a new one
const Loan = mongoose.models.Loan || mongoose.model("Loan", loanSchema);

module.exports = Loan;
