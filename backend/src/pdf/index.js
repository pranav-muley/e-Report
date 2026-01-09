const PDFDocument = require("pdfkit")
const { existsSync, mkdirSync, createWriteStream } = require("fs")
const { dirname } = require("path")


const templates = {
  NOTICE_130: require("./templates/notice_130.js"),
  FINAL_ORDER: require("./templates/final_order.js")
}

export async function generatePdf({ formType, content, outputPath }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 })

    const dir = dirname(outputPath)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

    const stream = createWriteStream(outputPath)
    doc.pipe(stream)

    // Marathi font
    doc.font("assets/fonts/NotoSansDevanagari-Regular.ttf")

    if (!templates[formType]) {
      return reject(new Error(`No PDF template for formType: ${formType}`))
    }

    templates[formType](doc, content)

    doc.end()

    stream.on("finish", resolve)
    stream.on("error", reject)
  })
}