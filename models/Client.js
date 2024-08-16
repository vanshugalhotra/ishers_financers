const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    signaturePhoto: {
      name: { type: String, default: "sign" },
      url: { type: String, required: true },
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    driveURL: {
      type: String,
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
    },
    atm: {
      type: String,
    },
    insurance: {
      type: String,
      default: "",
    },
    note: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
    },
    bankBranch: {
      type: String,
    },
    bankAccount: {
      type: String,
    },
    previousSalary: {
      type: Number,
      default: 0,
    },
    salary: {
      type: Number,
      default: 0,
    },
    loans: [
      {
        type: Schema.Types.ObjectId,
        ref: "Loan", // Assuming you have a Loan model
      },
    ],
    dob: {
      type: Date,
    },
    image: {
      name: { type: String },
      url: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists before creating a new one
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

module.exports = Client;
