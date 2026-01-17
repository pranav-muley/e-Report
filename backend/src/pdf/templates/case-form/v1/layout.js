const path = require("path")

const LOGO_PATH = path.resolve(
  __dirname,
  "../../../../assets/logos/MHlogo.png"
)

module.exports.render = function renderNotice130(doc, data, text) {
  /*
   * =========================
   * HEADER (LOGO + AUTHORITY)
   * =========================
   */

  try {
    doc.image(LOGO_PATH, {
      align: "center",
      width: 50
    })
    doc.moveDown(0.5)
  } catch (e) {
    // logo optional – do not crash PDF
  }

  doc
    .fontSize(13)
    .text(text.header.govt, { align: "center" })
    .text(
      `${text.header.authority} ${data.officer.office}`,
      { align: "center" }
    )
    .text(text.header.officeLine, { align: "center" })

  doc.moveDown(1.5)

  /*
   * =========
   * TITLE
   * =========
   */

  doc
    .fontSize(14)
    .text(text.title.main, { align: "center", underline: true })
    .fontSize(11)
    .text(text.title.section, { align: "center" })

  doc.moveDown(2)

  /*
   * ====================
   * CASE NUMBER & DATE
   * ====================
   */

  doc
    .fontSize(11)
    .text(
      `${text.labels.caseNumber} : ${data.caseNumber}`,
      { continued: true }
    )
    .text(`   ${text.labels.date} : ${data.caseDate}`)

  doc.moveDown(1.5)

  /*
   * ====================
   * PARTY BLOCK
   * ====================
   */

  doc.fontSize(11).text(text.labels.fromState)
  doc.text(text.labels.against)
  doc.moveDown(0.5)

  doc.fontSize(12).text(text.labels.respondents)
  doc.moveDown(0.5)

  data.accusedPersons.forEach((p, i) => {
    doc
      .fontSize(11)
      .text(
        `${i + 1}) श्री. ${p.name}, ${p.address}`,
        { indent: 20 }
      )
  })

  doc.moveDown(1.5)

  /*
   * ====================
   * POLICE REPORT + FACTS
   * ====================
   */

  doc.fontSize(11).text(text.paragraphs.policeReportIntro)
  doc.moveDown(0.5)
  doc.text(data.facts, { align: "justify" })

  doc.moveDown(1.5)

  /*
   * ====================
   * BOND DIRECTION
   * ====================
   */

  doc.fontSize(11).text(text.paragraphs.bondDirectionIntro)
  doc.moveDown(0.5)

  const bondLine = `${data.bond.suretyRequired ? "लायक जामीनदारासह" : "विनाजामीन"} प्रत्येकी रक्कम ₹${data.bond.amount}/- किंमतीचा ${data.bond.durationMonths} महिने मुदतीचा जामीन`

  doc.text(bondLine, { indent: 20 })

  doc.moveDown(0.5)
  doc.text(text.paragraphs.bondDirectionOutro)

  doc.moveDown(1.5)

  /*
   * ====================
   * HEARING DIRECTION
   * ====================
   */

  doc
    .fontSize(11)
    .text(
      `${text.paragraphs.hearingDirection} दिनांक ${data.hearing.date} रोजी ${data.hearing.time || ""} ${data.hearing.place} येथे.`,
      { align: "justify" }
    )

  doc.moveDown(1)

  doc.text(text.paragraphs.warning)

  doc.moveDown(2.5)

  /*
   * ====================
   * FOOTER / SIGNATURE
   * ====================
   */

  doc
    .fontSize(11)
    .text(`(${data.officer.name})`, { align: "right" })
    .text(text.footer.designation, { align: "right" })
    .text(data.officer.office, { align: "right" })

  doc.moveDown(1.5)

  doc
    .fontSize(10)
    .text(
      `${text.footer.copyTo} पोलीस निरीक्षक, ${data.policeStationName}`
    )
}
