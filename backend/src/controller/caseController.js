const Case = require("../model/case")

async function createCase(req, res, next) {
  try {
    const {
      branchCaseNumber,
      policeStationCaseNumber,
<<<<<<< HEAD
      section,
=======
      sections,
>>>>>>> origin/staging
      policeStationId,
      language
    } = req.body

    // officerId comes from auth middleware
    const officerId = req.user.id

    // Basic validation
    if (
      !branchCaseNumber ||
      !policeStationCaseNumber ||
<<<<<<< HEAD
      !section ||
=======
      !sections ||
>>>>>>> origin/staging
      !policeStationId
    ) {
      return res.status(400).json({
        message: "Missing required case details"
      })
    }

    const newCase = await Case.create({
      branchCaseNumber,
      policeStationCaseNumber,
<<<<<<< HEAD
      section,
=======
      sections,
>>>>>>> origin/staging
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

<<<<<<< HEAD
module.exports = {
  createCase
=======
async function getMyCases(req, res, next) {
  try {
    const cases = await Case.find({
      officerId: req.user.id
    })
      .sort({ createdAt: -1 })
      .select("branchCaseNumber sections status language createdAt")

    res.json({
      success: true,
      cases
    })
  } catch (err) {
    next(err)
  }
}

async function getCaseById(req, res, next) {
  try {
    const { caseId } = req.params

    const caseData = await Case.findOne({
      _id: caseId,
      officerId: req.user.id
    }).populate("policeStationId", "name")

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" })
    }

    res.json({
      success: true,
      case: caseData
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createCase,
  getMyCases,
  getCaseById
>>>>>>> origin/staging
}