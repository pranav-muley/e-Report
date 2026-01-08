const express = require("express")
const router = express.Router()

const {
  getPendingForms,
  approveForm,
  rejectForm,
  issueForm
} = require("../controllers/adminFormController")

const auth = require("../middleware/authMiddleware")
const requireRole = require("../middleware/roleMiddleware")

router.use(auth)
router.use(requireRole("ADMIN"))

router.get("/forms/pending", getPendingForms)
router.post("/forms/:id/approve", approveForm)
router.post("/forms/:id/reject", rejectForm)
router.post("/forms/:id/issue", issueForm)

module.exports = router