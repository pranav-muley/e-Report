const Form = require("../model/form")
const Case = require("../model/case")

/**
 * POST /cases/:caseId/roznama/entries
 * Admin-only
 * Auto-creates CASE_ROZNAMA if missing
 */
async function addRoznamaEntry(req, res, next) {
  try {
    const { caseId } = req.params
    const { entry, header } = req.body

    if (!entry?.date || !entry?.proceedings) {
      return res.status(400).json({
        message: "entry.date and entry.proceedings are required"
      })
    }

    // Fetch case
    const caseData = await Case.findById(caseId)
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" })
    }

    if (caseData.status === "CLOSED") {
      return res.status(400).json({
        message: "Cannot add roznama entry to closed case"
      })
    }

    // Find existing roznama
    let roznamaForm = await Form.findOne({
      caseId,
      formType: "CASE_ROZNAMA"
    })

    const isFirstEntry = !roznamaForm

    /* =========================
       CREATE ROZNAMA IF MISSING
       ========================= */
    if (!roznamaForm) {
      if (!header?.branchChapterCaseNo || !header?.policeChapterCaseNo) {
        return res.status(400).json({
          message: "Roznama header is required for first entry"
        })
      }

      roznamaForm = await Form.create({
        caseId,
        formType: "CASE_ROZNAMA",
        createdBy: req.user.id,
        content: {
          mr: {
            header: {
              branchChapterCaseNo: header.branchChapterCaseNo,
              policeChapterCaseNo: header.policeChapterCaseNo,
              policeStationName: header.policeStationName,
              sections: header.sections,
              applicant: header.applicant,
              defendants: header.defendants
            },
            entries: []
          }
        }
      })
    }

    /* =========================
       APPEND ENTRY
       ========================= */
    roznamaForm.content.mr.entries.push({
      date: entry.date,
      proceedings: entry.proceedings,
      nextDate: entry.nextDate || null,
      presentAccusedPersonIds: entry.presentAccusedPersonIds || []
    })

    await roznamaForm.save()

    res.json({
      success: true,
      createdRoznama: isFirstEntry,
      totalEntries: roznamaForm.content.mr.entries.length
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addRoznamaEntry
}
