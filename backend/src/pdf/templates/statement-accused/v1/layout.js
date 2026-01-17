const path = require("path")

const LOGO_PATH = path.resolve(
  __dirname,
  "../../../../assets/logos/MHlogo.png"
)

module.exports.render = function renderStatementAccused(doc, data, text) {
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
    // logo optional – never crash
  }

  doc
    .fontSize(13)
    .text(text.header.govt, { align: "center" })
    .text(text.header.authority, { align: "center" })
    .text(text.header.officeLine, { align: "center" })

  doc.moveDown(1.5)

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
   * INTRO
   * =========================
   */
  doc
    .fontSize(11)
    .text(text.intro.statement)

  doc.moveDown(1)

  /*
   * =========================
   * PERSONAL DETAILS BLOCK
   * =========================
   */
  doc.text(`${text.labels.name} : ${data.accused.name}`)
  doc.moveDown(0.4)

  doc.text(`${text.labels.address} : ${data.accused.address}`)
  doc.moveDown(0.4)

  doc.text(`${text.labels.age} : ${data.accused.age || "-"}`)
  doc.moveDown(0.4)

  doc.text(`${text.labels.education} : ${data.accused.education || "-"}`)
  doc.moveDown(0.4)

  doc.text(`${text.labels.occupation} : ${data.accused.occupation || "-"}`)

  doc.moveDown(2)

  /*
   * =========================
   * QUESTIONS & ANSWERS
   * =========================
   */
  const answerText = val =>
    val ? text.answers.yes : text.answers.no

  doc.text(`1) ${text.questions.q1}`)
  doc.moveDown(0.3)
  doc.text(`उत्तर : ${answerText(data.answers.noticeReceived)}`)
  doc.moveDown(1)

  doc.text(`2) ${text.questions.q2}`)
  doc.moveDown(0.3)
  doc.text(`उत्तर : ${answerText(data.answers.understandsNotice)}`)
  doc.moveDown(1)

  doc.text(`3) ${text.questions.q3}`)
  doc.moveDown(0.3)
  doc.text(`उत्तर : ${answerText(data.answers.agreesToMaintainPeace)}`)

  doc.moveDown(2.5)

  /*
   * =========================
   * DATE & PLACE
   * =========================
   */
  if (data.statementDate) {
    doc.text(
      `${text.footer.dateLabel} : ${new Date(
        data.statementDate
      ).toLocaleDateString("mr-IN")}`
    )
  }

  if (data.place) {
    doc.text(`${text.footer.placeLabel} : ${data.place}`)
  }

  doc.moveDown(3)

  /*
   * =========================
   * SIGNATURES
   * =========================
   */
  doc
    .text("__________________________", { align: "left" })
    .text(text.footer.accusedSignature)

  doc.moveDown(3)

  doc
    .text("__________________________", { align: "right" })
    .text(text.footer.authoritySignature, { align: "right" })
    .text(data.officer.office, { align: "right" })
}