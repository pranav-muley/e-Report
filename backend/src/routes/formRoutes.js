const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const requireRole = require("../middleware/roleMiddleware")
const {
  createForm,
  updateForm,
  submitForm,
  getFormById,
  getFormsByCase
} = require("../controller/formController")

router.use(auth)
router.use(requireRole("OFFICER"))

router.post("/cases/:caseId/forms", createForm)
router.put("/forms/:formId", updateForm)
router.post("/forms/:formId/submit", submitForm)
router.get("/cases/:caseId/forms", getFormsByCase)
router.get("/forms/:formId", getFormById)


module.exports = router
