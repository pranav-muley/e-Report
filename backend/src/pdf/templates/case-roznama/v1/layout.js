const path = require("path")

const LOGO_PATH = path.resolve(
  __dirname,
  "../../../../assets/logos/MHlogo.png"
)

const TABLE_COLS = {
  date: 70,
  proceedings: 320,
  nextDate: 90
}

module.exports.render = function renderCaseRoznama(doc, data, text) {
  const PAGE_BOTTOM = doc.page.height - doc.page.margins.bottom

  /* =========================
     HEADER + CASE INFO
     ========================= */
  function drawHeader() {
    try {
      doc.image(LOGO_PATH, { width: 45, align: "center" })
      doc.moveDown(0.5)
    } catch (e) {}

    doc
      .fontSize(13)
      .text(text.header.govt, { align: "center" })
      .text(text.header.authority, { align: "center" })
      .text(text.header.officeLine, { align: "center" })

    doc.moveDown(1)

    doc.fontSize(11)

    doc.text(
      `${text.caseInfoLabels.branchCaseNumber} : ${data.caseInfo.branchCaseNumber}`
    )

    if (data.caseInfo.policeCaseNumber) {
      doc.text(
        `${text.caseInfoLabels.policeCaseNumber} : ${data.caseInfo.policeCaseNumber}`
      )
    }

    doc.text(
      `${text.caseInfoLabels.policeStation} : ${data.caseInfo.policeStation} (${text.caseInfoLabels.policeStationCode} : ${data.caseInfo.policeStationCode})`
    )

    doc.text(
      `${text.caseInfoLabels.sections} : ${data.caseInfo.sections.join(", ")}`
    )

    doc.moveDown(0.4)

    if (data.caseInfo.complainant) {
      doc.text(
        `${text.caseInfoLabels.complainant} : ${data.caseInfo.complainant.name}, ${data.caseInfo.complainant.address || ""}`
      )
    }

    doc.moveDown(0.3)

    doc.text(`${text.caseInfoLabels.defendants} :`)
    data.caseInfo.defendants.forEach((d, i) => {
      doc.text(`${i + 1}) ${d.name}`, { indent: 20 })
    })

    doc.moveDown(1)

    doc
      .fontSize(14)
      .text(text.title.main, { align: "center", underline: true })

    doc.moveDown(1.5)
  }

  /* =========================
     TABLE HEADER
     ========================= */
  function drawTableHeader() {
    doc.fontSize(11)

    doc.text(text.table.date, doc.x, doc.y, {
      width: TABLE_COLS.date
    })

    doc.text(
      text.table.proceedings,
      doc.x + TABLE_COLS.date,
      doc.y,
      { width: TABLE_COLS.proceedings }
    )

    doc.text(
      text.table.nextDate,
      doc.x + TABLE_COLS.date + TABLE_COLS.proceedings,
      doc.y,
      { width: TABLE_COLS.nextDate }
    )

    doc.moveDown(0.5)
    doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.5)
  }

  function ensureSpace(height) {
    if (doc.y + height > PAGE_BOTTOM) {
      doc.addPage()
      drawHeader()
      drawTableHeader()
    }
  }

  /* =========================
     TABLE ROW
     ========================= */
  function drawRow(entry) {
    const startY = doc.y

    const proceedingsHeight = doc.heightOfString(entry.proceedings, {
      width: TABLE_COLS.proceedings
    })

    const rowHeight = Math.max(32, proceedingsHeight + 10)

    ensureSpace(rowHeight)

    doc.text(entry.date, doc.x, startY, {
      width: TABLE_COLS.date
    })

    doc.text(
      entry.proceedings,
      doc.x + TABLE_COLS.date,
      startY,
      { width: TABLE_COLS.proceedings }
    )

    doc.text(
      entry.nextDate || "-",
      doc.x + TABLE_COLS.date + TABLE_COLS.proceedings,
      startY,
      { width: TABLE_COLS.nextDate }
    )

    doc.y = startY + rowHeight
    doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.5)
  }

  /* =========================
     SIGNATURE BLOCK (FINAL)
     ========================= */
  function drawSignatureBlock(presentAccused) {
    const blockHeight = 80 + presentAccused.length * 20
    ensureSpace(blockHeight)

    doc.moveDown(1)
    doc.fontSize(11).text(text.signatures.presentAccused)

    presentAccused.forEach((p, i) => {
      doc.text(`${i + 1}) ${p.name}  ____________________`)
    })

    doc.moveDown(2)

    doc
      .text("__________________________", { align: "right" })
      .text(text.signatures.magistrate, { align: "right" })
      .text(data.officer.office, { align: "right" })
  }

  /* =========================
     RENDER START
     ========================= */
  drawHeader()
  drawTableHeader()

  data.entries.forEach((entry, index) => {
    drawRow(entry)

    // signatures ONLY after last entry
    if (index === data.entries.length - 1) {
      drawSignatureBlock(entry.presentAccused || [])
    }
  })
}