const mongoose = require("mongoose")

const PersonSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "case",
      required: true,
      index: true
    },

    name: { type: String, required: true },

    role: {
      type: String,
      enum: ["APPLICANT", "DEFENDANT", "WITNESS"],
      required: true,
      index: true
    },

    files: {
      signature: { type: String, default: null },
      photo: { type: String, default: null },
      document: { type: String, default: null }
    },

    address: { type: String },
    age: { type: Number },
    gender: { type: String },
    mobile: { type: String }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Person", PersonSchema)