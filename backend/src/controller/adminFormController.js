const formService = require("../service/formService")

/**
 * GET /admin/forms/pending
 */
async function getPendingForms(req, res, next) {
  try {
    const forms = await formService.getPendingForms()
    res.status(200).json({ success: true, data: forms })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /admin/forms/:id/approve
 */
async function approveForm(req, res, next) {
  try {
    const form = await formService.approveForm({
      formId: req.params.id,
      adminUserId: req.user.id
    })

    res.status(200).json({
      success: true,
      message: "Form approved successfully",
      data: form
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /admin/forms/:id/reject
 */
async function rejectForm(req, res, next) {
  try {
    const { reason } = req.body

    const form = await formService.rejectForm({
      formId: req.params.id,
      adminUserId: req.user.id,
      reason
    })

    res.status(200).json({
      success: true,
      message: "Form rejected",
      data: form
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /admin/forms/:id/issue
 */
async function issueForm(req, res, next) {
  try {
    const form = await formService.issueForm({
      formId: req.params.id,
      adminUserId: req.user.id
    })

    res.status(200).json({
      success: true,
      message: "Form issued and PDF generated",
      data: {
        id: form._id,
        pdfPath: form.generatedPdfPath
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getPendingForms,
  approveForm,
  rejectForm,
  issueForm
}