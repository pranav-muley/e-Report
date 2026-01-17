const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const checkRole = require("../middleware/roleMiddleware")

<<<<<<< HEAD
const { createCase } = require("../controller/caseController")
=======
const { createCase,getMyCases, getCaseById } = require("../controller/caseController")
>>>>>>> origin/staging

router.post(
  "/cases",
  auth,
//   checkRole("OFFICER", "ADMIN"),
  createCase
)

<<<<<<< HEAD
=======
router.post("/cases", createCase)
router.get("/cases", getMyCases)
router.get("/cases/:caseId", getCaseById)

>>>>>>> origin/staging
module.exports = router