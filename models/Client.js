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
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    aadharPhoto: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
    },
    panPhoto: {
      type: String,
      required: true,
    },
    chequeOrPassbookPhoto: {
      type: String,
      required: true,
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
      type: String,
      default: "avatar.svg",
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists before creating a new one
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

module.exports = Client;
