const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    loanNumber: {
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
      default: "avatar.svg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);
