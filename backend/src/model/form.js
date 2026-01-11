const mongoose = require("mongoose")

const FormSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true
    },

    formType: {
      type: String,
      required: true,
      index: true
    },

    content: {
      mr: { type: Object, default: {} },
      en: { type: Object, default: {} }
    },

    // WHO CREATED THE FORM (VERY IMPORTANT)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
      default: "DRAFT",
      index: true
    },

    approval: {
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      approvedAt: { type: Date },
      rejectionReason: { type: String }
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Form", FormSchema)