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
      // e.g. NOTICE_130, BOND_125, FINAL_ORDER
    },

    content: {
      mr: { type: Object },
      en: { type: Object }
    },

    generatedPdfPath: { type: String },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    issuedAt: { type: Date },

    status: {
      type: String,
      enum: ["DRAFT", "GENERATED", "SIGNED", "SERVED"],
      default: "DRAFT"
    },
    approval: {
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        approvedAt: { type: Date },
        rejectionReason: { type: String }
      }
  },

  { timestamps: true }
)

module.exports = mongoose.model("Form", FormSchema)