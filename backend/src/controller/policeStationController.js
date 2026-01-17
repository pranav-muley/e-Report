
const PoliceStation = require("../model/policeStation")

// GET ALL
async function getAllPoliceStations(req, res, next) {
  try {
    const stations = await PoliceStation.find({ isActive: true })
      .sort({ name: 1 })

    res.json(stations)
  } catch (err) {
    next(err)
  }
}

// GET BY ID
async function getPoliceStationById(req, res, next) {
  try {
    const { id } = req.params

    const station = await PoliceStation.findById(id)
    if (!station) {
      return res.status(404).json({
        message: "Police station not found"
      })
    }

    res.json(station)
  } catch (err) {
    next(err)
  }
}

// UPDATE
async function updatePoliceStation(req, res, next) {
  try {
    const { id } = req.params
    const update = req.body

    const station = await PoliceStation.findByIdAndUpdate(
      id,
      update,
      { new: true }
    )

    if (!station) {
      return res.status(404).json({
        message: "Police station not found"
      })
    }

    res.json(station)
  } catch (err) {
    next(err)
  }
}

async function createPoliceStation(req, res, next) {
    try {
      const { name, code, district, taluka, address } = req.body
  
      if (!name || !code || !district || !taluka) {
        return res.status(400).json({
          message: "name, code, district and taluka are required"
        })
      }
  
      const station = await PoliceStation.create({
        name,
        code,
        district,
        taluka,
        address
      })
  
      res.status(201).json(station)
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Police station code already exists"
        })
      }
      next(err)
    }
  }  

  module.exports = {
    createPoliceStation,
    getAllPoliceStations,
    getPoliceStationById,
    updatePoliceStation,
  }