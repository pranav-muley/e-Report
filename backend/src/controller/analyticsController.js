const mongoose = require("mongoose")
const Case = require("../model/case")
const Form = require("../model/form")
const Person = require("../model/person")
const PoliceStation = require("../model/policeStation")
const AIInsight = require("../model/aiInsight")
const { generateCaseSummary, generateDigest } = require("../service/aiService")

const DAY_MS = 24 * 60 * 60 * 1000

function toDateSafe(value) {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

async function getAnalyticsOverview(req, res, next) {
  try {
    const isAdmin = req.user.role === "ADMIN"
    const caseQuery = isAdmin ? {} : { officerId: req.user.id }

    const totalCasesPromise = Case.countDocuments(caseQuery)
    const closedCasesPromise = Case.countDocuments({ ...caseQuery, status: "CLOSED" })
    const activeCasesPromise = Case.countDocuments({ ...caseQuery, status: { $ne: "CLOSED" } })

    const pendingFormsPromise = Form.countDocuments(
      isAdmin ? { status: "DRAFT" } : { status: "DRAFT", createdBy: req.user.id }
    )

    const casesByPoliceStationPromise = Case.aggregate([
      { $match: caseQuery },
      { $group: { _id: "$policeStationId", count: { $sum: 1 } } }
    ])

    const casesBySectionPromise = Case.aggregate([
      { $match: caseQuery },
      { $unwind: "$sections" },
      { $group: { _id: "$sections", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const avgTimeByStatusPromise = Case.aggregate([
      { $match: caseQuery },
      {
        $group: {
          _id: "$status",
          avgAgeMs: { $avg: { $subtract: [new Date(), "$createdAt"] } },
          count: { $sum: 1 }
        }
      }
    ])

    const [totalCases, closedCases, activeCases, pendingForms,
      casesByPoliceStation, casesBySection, avgTimeByStatus] = await Promise.all([
        totalCasesPromise,
        closedCasesPromise,
        activeCasesPromise,
        pendingFormsPromise,
        casesByPoliceStationPromise,
        casesBySectionPromise,
        avgTimeByStatusPromise
      ])

    const policeStationIds = casesByPoliceStation.map(i => i._id).filter(Boolean)
    const stations = await PoliceStation.find({ _id: { $in: policeStationIds } })
      .select("_id name")
    const stationMap = new Map(stations.map(s => [String(s._id), s.name]))

    const casesByPoliceStationResolved = casesByPoliceStation.map(i => ({
      policeStationId: i._id,
      policeStationName: stationMap.get(String(i._id)) || "Unknown",
      count: i.count
    }))

    const avgTimeByStatusDays = avgTimeByStatus.map(s => ({
      status: s._id,
      avgDays: s.avgAgeMs ? Math.round(s.avgAgeMs / DAY_MS) : 0,
      count: s.count
    }))

    // Hearing overdue (NOTICE_130 hearing date in past)
    const noticeForms = await Form.find({
      formType: "NOTICE_130",
      ...(isAdmin ? {} : { createdBy: req.user.id })
    }).select("caseId content createdAt")

    const today = new Date()
    const hearingOverdue = []
    for (const form of noticeForms) {
      const hearingDate = form?.content?.mr?.hearing?.date || form?.content?.mr?.hearingDate
      const parsed = toDateSafe(hearingDate)
      if (parsed && parsed < today) {
        hearingOverdue.push({
          caseId: form.caseId,
          hearingDate: parsed.toISOString().slice(0, 10)
        })
      }
    }

    res.json({
      success: true,
      metrics: {
        totalCases,
        activeCases,
        closedCases,
        pendingForms
      },
      avgTimeByStatus: avgTimeByStatusDays,
      casesByPoliceStation: casesByPoliceStationResolved,
      casesBySection,
      hearingOverdueCount: hearingOverdue.length,
      hearingOverdue
    })
  } catch (err) {
    next(err)
  }
}

async function getCaseSummary(req, res, next) {
  try {
    const { caseId } = req.params
    const force = req.query.force === "1"
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ message: "Invalid caseId" })
    }

    const caseData = await Case.findById(caseId).lean()
    if (!caseData) return res.status(404).json({ message: "Case not found" })

    if (req.user.role !== "ADMIN" && String(caseData.officerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" })
    }

    const [persons, forms] = await Promise.all([
      Person.find({ caseId }).lean(),
      Form.find({ caseId }).lean()
    ])

    if (!force) {
      const cached = await AIInsight.findOne({
        type: "CASE_SUMMARY",
        caseId,
        userId: req.user.id
      }).sort({ createdAt: -1 })

      if (cached) {
        return res.json({ success: true, summary: cached.payload, cached: true })
      }
    }

    const result = await generateCaseSummary({ caseData, persons, forms })
    await AIInsight.create({
      type: "CASE_SUMMARY",
      caseId,
      userId: req.user.id,
      payload: result
    })

    res.json({ success: true, summary: result, cached: false })
  } catch (err) {
    next(err)
  }
}

async function getAIDigest(req, res, next) {
  try {
    const force = req.query.force === "1"
    const since = new Date(Date.now() - DAY_MS)

    if (!force) {
      const cached = await AIInsight.findOne({
        type: "DIGEST",
        userId: req.user.id,
        createdAt: { $gte: since }
      }).sort({ createdAt: -1 })

      if (cached) {
        return res.json({ success: true, digest: cached.payload, cached: true })
      }
    }

    const overview = await getOverviewPayload(req.user)
    const digest = await generateDigest(overview)
    await AIInsight.create({
      type: "DIGEST",
      userId: req.user.id,
      payload: digest
    })

    res.json({ success: true, digest, cached: false })
  } catch (err) {
    next(err)
  }
}

async function getOverviewPayload(user) {
  const isAdmin = user.role === "ADMIN"
  const caseQuery = isAdmin ? {} : { officerId: user.id }

  const [cases, forms] = await Promise.all([
    Case.find(caseQuery).lean(),
    Form.find(isAdmin ? {} : { createdBy: user.id }).lean()
  ])

  return { cases, forms }
}

module.exports = {
  getAnalyticsOverview,
  getAIDigest,
  getCaseSummary
}
