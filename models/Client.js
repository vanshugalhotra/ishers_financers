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
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    aadharPhoto: {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
    },
    panPhoto: {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
    chequeOrPassbookPhoto: {
      name: { type: String, required: true },
      url: { type: String, required: true },
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
