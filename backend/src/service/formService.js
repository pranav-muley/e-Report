const Form = require("../model/form")
const CaseEvent = require("../model/caseEvent")
const { join } = require("path")
const { generatePdf } = require("../pdf")

/**
 * ADMIN – Get all pending (submitted) forms
 */
async function getPendingForms() {
  const forms = await Form.find({ status: "SUBMITTED" })
    .sort({ createdAt: -1 })
    .populate("caseId", "branchCaseNumber sections")
    .populate("createdBy", "name")

  return forms
}

/**
 * ADMIN – Approve submitted form
 */
async function approveForm({ formId, adminUserId }) {
  const form = await Form.findById(formId)
  if (!form) throw new Error("Form not found")

  if (form.status !== "SUBMITTED") {
    throw new Error("Only submitted forms can be approved")
  }

  form.status = "APPROVED"
  form.approval = {
    approvedBy: adminUserId,
    approvedAt: new Date()
  }

  await form.save()

  await CaseEvent.create({
    caseId: form.caseId,
    eventType: "FORM_APPROVED",
    referenceId: form._id,
    performedBy: adminUserId
  })

  return form
}

/**
 * ADMIN – Reject submitted form
 */
async function rejectForm({ formId, adminUserId, reason }) {
  if (!reason) throw new Error("Rejection reason is required")

  const form = await Form.findById(formId)
  if (!form) throw new Error("Form not found")

  if (form.status !== "SUBMITTED") {
    throw new Error("Only submitted forms can be rejected")
  }

  form.status = "REJECTED"
  form.approval = {
    approvedBy: adminUserId,
    approvedAt: new Date(),
    rejectionReason: reason
  }

  await form.save()

  await CaseEvent.create({
    caseId: form.caseId,
    eventType: "FORM_REJECTED",
    referenceId: form._id,
    performedBy: adminUserId,
    remarks: reason
  })

  return form
}

/**
 * ADMIN – Issue approved form (generate PDF)
 */
async function issueForm({ formId, adminUserId }) {
  const form = await Form.findById(formId)
  if (!form) throw new Error("Form not found")

  if (form.status !== "APPROVED") {
    throw new Error("Only approved forms can be issued")
  }

  const outputPath = join(
    "uploads",
    "cases",
    String(form.caseId),
    `${form._id}.pdf`
  )

  await generatePdf({
    formType: form.formType,
    content: form.content.mr,
    outputPath
  })

  form.status = "ISSUED"
  form.issuedAt = new Date()
  form.issuedBy = adminUserId
  form.generatedPdfPath = outputPath

  await form.save()

  await CaseEvent.create({
    caseId: form.caseId,
    eventType: "FORM_ISSUED",
    referenceId: form._id,
    performedBy: adminUserId
  })

  return form
}

module.exports = {
  getPendingForms,
  approveForm,
  rejectForm,
  issueForm
}
