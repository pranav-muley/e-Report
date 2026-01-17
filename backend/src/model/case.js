const mongoose = require("mongoose")

const caseSchema = new mongoose.Schema(
  {
    // From police station report
    branchCaseNumber: {
      type: String,
      required: true,
      trim: true
    },

    policeStationCaseNumber: {
      type: String,
      required: true,
      trim: true
    },

<<<<<<< HEAD
    section: {
      type: String,
      required: true,
      trim: true
=======
    sections: {
      type: [String],
      required: true
>>>>>>> origin/staging
    },

    policeStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "policestation",
      required: true,
      index: true
    },

    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "NOTICE_ISSUED",
        "HEARING",
        "ORDER_PASSED",
        "CLOSED"
      ],
      default: "DRAFT",
      index: true
    },

    language: {
      type: String,
      enum: ["MR", "EN", "BOTH"],
      default: "MR"
    }
  },
  { timestamps: true }
)

<<<<<<< HEAD
module.exports = mongoose.model("case", caseSchema)
=======
module.exports = mongoose.model("Case", caseSchema)
>>>>>>> origin/staging
