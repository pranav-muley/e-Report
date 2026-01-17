const path = require("path")

const LOGO_PATH = path.resolve(
  __dirname,
  "../../../../assets/logos/MHlogo.png"
)

module.exports.render = function renderInterimBond(doc, data, text) {

  /*
   * =========================
   * HEADER
   * =========================
   */
  try {
    doc.image(LOGO_PATH, { width: 50, align: "center" })
    doc.moveDown(0.5)
  } catch (e) {}

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
    .text(text.title.main, { align: "center", underline: true })
    .fontSize(11)
    .text(text.title.section, { align: "center" })

  doc.moveDown(2)

  /*
   * =========================
   * ACCUSED DETAILS
   * =========================
   */
  doc.fontSize(11).text(text.paragraphs.accusedIntro)
  doc.moveDown(0.5)

  doc.text(
    `मी श्री. ${data.accused.name}, वय ${data.accused.age || "-"} वर्षे, ${data.accused.address} येथील राहणारा,`
  )

  doc.moveDown(0.5)
  doc.text(text.paragraphs.accusedUndertaking)

  doc.moveDown(1.5)

  /*
   * =========================
   * BOND DETAILS
   * =========================
   */
  doc.text(text.paragraphs.bondExecution)
  doc.moveDown(0.5)

  doc.text(text.paragraphs.bondConditionIntro)

  doc.moveDown(0.5)
  doc.text(
    `• ${text.labels.bondAmount}: ₹${data.bond.amount}/-`
  )
  doc.text(
    `• ${text.labels.bondDuration}: ${data.bond.durationMonths} महिने`
  )
  doc.text(
    `• ${text.labels.bondCondition}: ${data.bond.condition}`
  )

  doc.moveDown(1.5)

  /*
   * =========================
   * VALIDITY
   * =========================
   */
  if (data.validity?.untilCaseCompletion) {
    doc.text(
      "हे बंधपत्र चौकशी पूर्ण होईपर्यंत किंवा पुढील आदेश होईपर्यंत लागू राहील."
    )
    doc.moveDown(1.5)
  }

  /*
   * =========================
   * SURETY SECTION (OPTIONAL)
   * =========================
   */
  if (data.sureties && data.sureties.length > 0) {
    doc.fontSize(11).text(text.paragraphs.suretyIntro)
    doc.moveDown(0.5)

    data.sureties.forEach((s, i) => {
      doc.text(
        `${i + 1}) श्री. ${s.name}, वय ${s.age || "-"} वर्षे, ${s.address}`
      )
    })

    doc.moveDown(0.5)
    doc.text(text.paragraphs.suretyUndertaking)

    doc.moveDown(1.5)
  }

  /*
   * =========================
   * EXECUTION DATE
   * =========================
   */
  if (data.executionDate) {
    doc.text(
      `${text.labels.executionDate}: ${new Date(
        data.executionDate
      ).toLocaleDateString("mr-IN")}`
    )
    doc.moveDown(2)
  }

  /*
   * =========================
   * SIGNATURES
   * =========================
   */
  doc
    .fontSize(11)
    .text("__________________________", { align: "left" })
    .text(text.footer.accusedSignature)

  if (data.sureties && data.sureties.length > 0) {
    doc.moveDown(1)
    doc.text("__________________________")
    doc.text(text.footer.suretySignature)
  }

  doc.moveDown(2)

  doc
    .text("__________________________", { align: "right" })
    .text(text.footer.authoritySignature, { align: "right" })
    .text(data.officer.office, { align: "right" })
}