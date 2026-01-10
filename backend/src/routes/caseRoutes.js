const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const checkRole = require("../middleware/roleMiddleware")

const { createCase,getMyCases, getCaseById } = require("../controller/caseController")

router.post(
  "/cases",
  auth,
//   checkRole("OFFICER", "ADMIN"),
  createCase
)

router.post("/cases", createCase)
router.get("/cases", getMyCases)
router.get("/cases/:caseId", getCaseById)

module.exports = router