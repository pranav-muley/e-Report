const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "OFFICER"],
      required: true
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)
