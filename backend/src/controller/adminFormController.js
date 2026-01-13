const caseFileService = require("../service/caseFileService")
const Form = require("../model/form")
const { transitionCaseStatus } = require("../service/caseStatusService")

/* =========================
   GET PENDING FORMS
   ========================= */
   async function getPendingForms(req, res, next) {
    try {
      const forms = await Form.find({ status: "SUBMITTED" })
        .sort({ createdAt: -1 })
        .populate("caseId", "branchCaseNumber sections status")
        .populate("createdBy", "name role")
  
      res.json({ success: true, forms })
    } catch (err) {
      next(err)
    }
  }
  

/* =========================
   APPROVE FORM
   ========================= */
async function approveForm(req, res, next) {
  try {
    const { formId } = req.params

    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({ message: "Form not found" })
    }

    if (form.status !== "SUBMITTED") {
      return res.status(400).json({ message: "Form not in submitted state" })
    }

    form.status = "APPROVED"
    form.approval = {
      approvedBy: req.user.id,
      approvedAt: new Date()
    }

    await form.save()

    /* CASE STATUS TRANSITION (CONDITIONAL) */
    if (form.formType === "NOTICE_130") {
      await transitionCaseStatus({
        caseId: form.caseId,
        toStatus: "NOTICE_ISSUED",
        performedBy: req.user.id
      })
    }

    if (form.formType === "FINAL_ORDER") {
      await transitionCaseStatus({
        caseId: form.caseId,
        toStatus: "ORDER_PASSED",
        performedBy: req.user.id
      })
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

/* =========================
   REJECT FORM
   ========================= */
async function rejectForm(req, res, next) {
  try {
    const { formId } = req.params
    const { reason } = req.body

    if (!reason) {
      return res.status(400).json({
        message: "Rejection reason required"
      })
    }

    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({ message: "Form not found" })
    }

    if (form.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Form not in submitted state"
      })
    }

    form.status = "REJECTED"
    form.approval = {
      approvedBy: req.user.id,
      approvedAt: new Date(),
      rejectionReason: reason
    }

    await form.save()

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

/* =========================
   GET FORM DETAILS (ADMIN)
   ========================= */
async function getFormForAdmin(req, res, next) {
  try {
    const { formId } = req.params

    const form = await Form.findById(formId)
      .populate("caseId", "branchCaseNumber sections status")
      .populate("createdBy", "name role")

    if (!form) {
      return res.status(404).json({ message: "Form not found" })
    }

    res.json({ success: true, form })
  } catch (err) {
    next(err)
  }
}

/* =========================
   ISSUE FINAL CASE FILE
   ========================= */
async function issueCaseFileController(req, res) {
  try {
    const { caseId, caseFileNumber } = req.body
    if (!caseId || !caseFileNumber) {
      return res.status(400).json({
        message: "caseId and caseFileNumber are required"
      })
    }

    const issuedBy = req.user.id

    const caseFile = await caseFileService.issueCaseFile({
      caseId,
      caseFileNumber,
      issuedBy
    })

    // FINAL STATUS → CLOSED
    await transitionCaseStatus({
      caseId,
      toStatus: "CLOSED",
      performedBy: issuedBy
    })

    res.status(201).json({
      success: true,
      caseFileId: caseFile._id,
      pdfPath: caseFile.pdf.path
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  getPendingForms,
  approveForm,
  rejectForm,
  getFormForAdmin,
  issueCaseFileController
}
