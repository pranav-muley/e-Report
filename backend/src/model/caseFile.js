const mongoose = require("mongoose")

const CaseFileSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true
    },

    caseFileNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    language: {
      type: String,
      enum: ["MR", "EN", "BOTH"],
      default: "MR"
    },

    pages: [
      {
        type: {
          type: String, // CASE_FORM, NOTICE_130, FINAL_ORDER
          required: true
        },
        templateVersion: {
          type: String, // v1
          required: true
        },
        data: {
          type: Object, // SNAPSHOT DATA
          required: true
        }
      }
    ],

    pdf: {
      path: {
        type: String,
        required: true
      },
      hash: {
        type: String,
        required: true
      }
    },

    issuedAt: {
      type: Date,
      required: true
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["ISSUED"],
      default: "ISSUED"
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("CaseFile", CaseFileSchema)