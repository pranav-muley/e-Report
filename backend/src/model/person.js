const mongoose = require("mongoose")

const PersonSchema = new mongoose.Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
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

    address: { type: String },
    age: { type: Number },
    gender: { type: String },
    mobile: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model("person", PersonSchema)