const mongoose = require("mongoose")

const policeStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },

    address: {
      type: String,
      trim: true
    },

    district: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
)

module.exports =
  mongoose.models.Policestation ||
  mongoose.model("Policestation", policeStationSchema);
