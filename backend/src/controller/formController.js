const Form = require("../model/form")

/* =========================
   CREATE FORM
   ========================= */
async function createForm(req, res, next) {
  try {
    const { caseId } = req.params
    const { formType, content } = req.body

    // CASE_ROZNAMA → ADMIN ONLY
    if (formType === "CASE_ROZNAMA" && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can create CASE_ROZNAMA"
      })
    }

    // Prevent duplicate active forms
    const existing = await Form.findOne({
      caseId,
      formType,
      status: { $in: ["DRAFT", "SUBMITTED", "APPROVED"] }
    })

    if (existing) {
      return res.status(400).json({
        message: `${formType} already exists for this case`
      })
    }

    const form = await Form.create({
      caseId,
      formType,
      content,
      createdBy: req.user.id
    })

    res.status(201).json({
      success: true,
      formId: form._id,
      status: form.status
    })
  } catch (err) {
    next(err)
  }
}

/* =========================
   UPDATE FORM (NON-ROZNAMA)
   ========================= */
async function updateForm(req, res, next) {
  try {
    const { formId } = req.params
    const { content } = req.body

    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({ message: "Form not found" })
    }

    if (form.formType === "CASE_ROZNAMA") {
      return res.status(400).json({
        message: "Use roznama entry API"
      })
    }

    if (form.status !== "DRAFT") {
      return res.status(400).json({
        message: "Form is not editable"
      })
    }

    // Only creator can edit
    if (String(form.createdBy) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You cannot edit this form"
      })
    }

    form.content = content
    await form.save()

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

/* =========================
   SUBMIT FORM (OFFICER → ADMIN)
   ========================= */
async function submitForm(req, res, next) {
  try {
    const { formId } = req.params

    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({ message: "Form not found" })
    }

    if (form.formType === "CASE_ROZNAMA") {
      return res.status(400).json({
        message: "Roznama does not require submission"
      })
    }

    if (form.status !== "DRAFT") {
      return res.status(400).json({
        message: "Form already submitted"
      })
    }

    if (String(form.createdBy) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You cannot submit this form"
      })
    }

    form.status = "SUBMITTED"
    await form.save()

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

/* =========================
   LIST FORMS BY CASE
   ========================= */
async function getFormsByCase(req, res, next) {
  try {
    const { caseId } = req.params

    const query = { caseId }

    // Officers see only their forms
    if (req.user.role !== "ADMIN") {
      query.createdBy = req.user.id
    }

    const forms = await Form.find(query)
      .sort({ createdAt: -1 })
      .select("formType status createdAt")

    res.json({ success: true, forms })
  } catch (err) {
    next(err)
  }
}

/* =========================
   GET FORM BY ID
   ========================= */
async function getFormById(req, res, next) {
  try {
    const { formId } = req.params

    const form = await Form.findById(formId)
      .populate("caseId", "branchCaseNumber sections")

    if (!form) {
      return res.status(404).json({ message: "Form not found" })
    }

    // Officers cannot access others' forms
    if (
      req.user.role !== "ADMIN" &&
      String(form.createdBy) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: "Access denied"
      })
    }

    res.json({ success: true, form })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createForm,
  updateForm,
  submitForm,
  getFormsByCase,
  getFormById
}