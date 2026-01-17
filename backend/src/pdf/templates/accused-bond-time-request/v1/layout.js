const path = require("path")

const LOGO_PATH = path.resolve(
  __dirname,
  "../../../../assets/logos/MHlogo.png"
)

module.exports.render = function renderAccusedBondTimeRequest(doc, data, text) {
  /*
   * =========================
   * HEADER (LOGO + AUTHORITY)
   * =========================
   */
  try {
    doc.image(LOGO_PATH, {
      width: 50,
      align: "center"
    })
    doc.moveDown(0.6)
  } catch (e) {
    // logo optional – do not crash
  }

  doc
    .fontSize(13)
    .text(text.header.govt, { align: "center" })
    .text(text.header.authority, { align: "center" })
    .text(text.header.officeLine, { align: "center" })

  doc.moveDown(2)

  /*
   * =========================
   * TITLE
   * =========================
   */
  doc
    .fontSize(14)
    .text(text.title.main, {
      align: "center",
      underline: true
    })

  doc.moveDown(2)

  /*
   * =========================
   * ADDRESSING AUTHORITY
   * =========================
   */
  doc
    .fontSize(11)
    .text(text.intro.toAuthority)
    .text(text.header.authority)
    .moveDown(1)

  /*
   * =========================
   * SUBJECT
   * =========================
   */
  doc
    .fontSize(11)
    .text(
      `${text.intro.subjectPrefix} ${text.intro.subject}`,
      { underline: true }
    )

  doc.moveDown(2)

  /*
   * =========================
   * BODY PARAGRAPHS
   * =========================
   */
  doc.text(text.paragraphs.opening)
  doc.moveDown(0.8)

  doc.text(text.paragraphs.caseContext)
  doc.moveDown(0.8)

  doc.text(text.paragraphs.difficulty)
  doc.moveDown(0.8)

  doc.text(text.paragraphs.request)
  doc.moveDown(0.8)

  doc.text(text.paragraphs.undertaking)

  doc.moveDown(3)

  /*
   * =========================
   * DATE & PLACE
   * =========================
   */
  if (data.applicationDate) {
    doc.text(
      `${text.footer.dateLabel} : ${new Date(
        data.applicationDate
      ).toLocaleDateString("mr-IN")}`
    )
  }

  if (data.place) {
    doc.text(`${text.footer.placeLabel} : ${data.place}`)
  }

  doc.moveDown(3)

  /*
   * =========================
   * SIGNATURE
   * =========================
   */
  doc
    .text("__________________________", { align: "right" })
    .text(text.footer.accusedSignature, { align: "right" })

  doc.moveDown(1)

  /*
   * =========================
   * ACCUSED DETAILS (UNDER SIGNATURE)
   * =========================
   */
  doc
    .fontSize(11)
    .text(`नाव : ${data.accused.name}`, { align: "right" })
    .text(`पत्ता : ${data.accused.address}`, { align: "right" })
}