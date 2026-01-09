const mongoose = require("mongoose")


const PoliceStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    district: { type: String },
    taluka: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model("policeStation", PoliceStationSchema)
