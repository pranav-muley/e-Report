const express = require("express")
const router = express.Router()

const {
  getPendingForms,
  approveForm,
  rejectForm,
  getFormForAdmin,
  issueCaseFileController
} = require("../controller/adminFormController")

const auth = require("../middleware/authMiddleware")
const requireRole = require("../middleware/roleMiddleware")
const generate = require("../controller/generatePdfController");
const { addRoznamaEntry } = require("../controller/roznamaController")

router.use(auth)
// router.use(requireRole("ADMIN"))

router.get("/admin/forms/pending", getPendingForms)
router.post("/admin/forms/:formId/approve", approveForm)
router.post("/admin/forms/:formId/reject", rejectForm)
// router.post("/admin/forms/:formId/issue", issueForm)

router.get("/admin/forms/pending", getPendingForms)
router.get("/admin/forms/:formId", getFormForAdmin)
router.post("/api/casefiles/issue", issueCaseFileController)
router.post(
  "/cases/:caseId/roznama/entries",
  auth,
  requireRole("ADMIN"),
  addRoznamaEntry
)

module.exports = router