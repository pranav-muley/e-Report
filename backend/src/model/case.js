const mongoose = require("mongoose")

const CaseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    section: { type: String, required: true },

    policeStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
      required: true,
      index: true
    },

    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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

export default mongoose.model("case", CaseSchema)