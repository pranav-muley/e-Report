const caseFileService = require("../service/caseFileService")
const { transitionCaseStatus } = require("../service/caseStatusService")
const Case = require("../model/case")
const Form = require("../model/form")

async function issueCaseFileController(req, res) {
  try {
    const { caseId, caseFileNumber } = req.body
    const issuedBy = req.user.id

    if (!caseId || !caseFileNumber) {
      return res.status(400).json({
        message: "caseId and caseFileNumber are required"
      })
    }

    // Case must exist & be ORDER_PASSED
    const caseData = await Case.findById(caseId)
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" })
    }

    if (caseData.status !== "ORDER_PASSED") {
      return res.status(400).json({
        message: "Case is not ready for issuance"
      })
    }

    // FINAL_ORDER must be approved
    const finalOrder = await Form.findOne({
      caseId,
      formType: "FINAL_ORDER",
      status: "APPROVED"
    })

    if (!finalOrder) {
      return res.status(400).json({
        message: "FINAL_ORDER must be approved before issuing CaseFile"
      })
    }

    const caseFile = await caseFileService.issueCaseFile({
      caseId,
      caseFileNumber,
      issuedBy
    })

    // Move case to CLOSED
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
    console.error(err)
    res.status(400).json({ message: err.message })
  }
}

module.exports = {
  issueCaseFileController
}
