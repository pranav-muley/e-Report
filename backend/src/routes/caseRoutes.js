const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const checkRole = require("../middleware/roleMiddleware")

const { createCase } = require("../controller/caseController")

router.post(
  "/cases",
  auth,
//   checkRole("OFFICER", "ADMIN"),
  createCase
)

module.exports = router