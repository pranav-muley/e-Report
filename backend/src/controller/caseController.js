const Case = require("../model/case")

async function createCase(req, res, next) {
  try {
    const {
      branchCaseNumber,
      policeStationCaseNumber,
      section,
      policeStationId,
      language
    } = req.body

    // officerId comes from auth middleware
    const officerId = req.user.id

    // Basic validation
    if (
      !branchCaseNumber ||
      !policeStationCaseNumber ||
      !section ||
      !policeStationId
    ) {
      return res.status(400).json({
        message: "Missing required case details"
      })
    }

    const newCase = await Case.create({
      branchCaseNumber,
      policeStationCaseNumber,
      section,
      policeStationId,
      officerId,
      language
    })

    res.status(201).json({
      caseId: newCase._id,
      status: newCase.status
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createCase
}