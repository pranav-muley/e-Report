const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const checkRole = require("../middleware/roleMiddleware")

const {
  createPoliceStation,
  getAllPoliceStations,
  getPoliceStationById,
  updatePoliceStation
} = require("../controller/policeStationController")

// Admin only (master data)
router.post(
  "/police-stations",
  auth,
  checkRole("ADMIN"),
  createPoliceStation
)

router.put(
  "/police-stations/:id",
  auth,
  checkRole("ADMIN"),
  updatePoliceStation
)

// Officer + Admin
router.get(
  "/police-stations",
  auth,
  getAllPoliceStations
)

router.get(
  "/police-stations/:id",
  auth,
  getPoliceStationById
)

module.exports = router