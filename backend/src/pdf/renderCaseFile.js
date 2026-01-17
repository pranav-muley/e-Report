// pdf/renderCaseFile.js
const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const { loadTemplate } = require("./templates")

async function renderCaseFile(caseFile, outputPath) {
  const doc = new PDFDocument({ size: "A4", margin: 50 })
  const stream = fs.createWriteStream(outputPath)
  doc.pipe(stream)

  // Load Marathi font ONCE
  doc.font(
    path.resolve(__dirname, "../assets/fonts/NotoSansDevanagari-Regular.ttf")
  )

  caseFile.pages.forEach((page, index) => {
    if (index > 0) doc.addPage()

    const template = loadTemplate(page.pageType, page.templateVersion)

    template.render(doc, page.data, template.text)
  })

  doc.end()

  await new Promise(resolve => stream.on("finish", resolve))

  // Hash for immutability
  const pdfBuffer = fs.readFileSync(outputPath)
  const hash = crypto.createHash("sha256").update(pdfBuffer).digest("hex")

  return {
    path: outputPath,
    hash
  }
}

module.exports = { renderCaseFile }