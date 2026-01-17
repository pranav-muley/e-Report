const Case = require("../model/case")
const CaseEvent = require("../model/caseEvent")

const VALID_TRANSITIONS = {
  DRAFT: ["NOTICE_ISSUED"],
  NOTICE_ISSUED: ["HEARING"],
  HEARING: ["ORDER_PASSED"],
  ORDER_PASSED: ["CLOSED"]
}

/**
 * Safely transition case status
 */
async function transitionCaseStatus({
  caseId,
  toStatus,
  performedBy,
  remarks
}) {
  if (!caseId) throw new Error("caseId is required")
  if (!toStatus) throw new Error("toStatus is required")
  if (!performedBy) throw new Error("performedBy is required")

  const caseData = await Case.findById(caseId)
  if (!caseData) throw new Error("Case not found")

  const fromStatus = caseData.status

  // Prevent illegal transitions
  const allowed = VALID_TRANSITIONS[fromStatus] || []
  if (!allowed.includes(toStatus)) {
    throw new Error(
      `Invalid case status transition: ${fromStatus} → ${toStatus}`
    )
  }

  // Update case
  caseData.status = toStatus
  await caseData.save()

  // Log event (audit trail)
  await CaseEvent.create({
    caseId,
    eventType: "CASE_STATUS_CHANGED",
    referenceId: caseData._id,
    performedBy,
    remarks: remarks || `${fromStatus} → ${toStatus}`
  })

  return caseData
}

module.exports = {
  transitionCaseStatus
}
