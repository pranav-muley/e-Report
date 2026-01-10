const mongoose = require("mongoose")

const CaseEventSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true
    },

    eventType: {
      type: String,
      required: true // CASE_CREATED, NOTICE_ISSUED, HEARING_FIXED, ORDER_PASSED
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId
      // usually Form._id
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    remarks: { type: String }
  },
  { timestamps: true }
)

module.exports = mongoose.model("CaseEvent", CaseEventSchema)