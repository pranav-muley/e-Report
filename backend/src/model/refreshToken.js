const mongoose = require("mongoose")

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true   // this one is fine
    },

    tokenHash: {
      type: String,
      required: true
    },

    userAgent: String,
    ip: String,

    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

RefreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema)