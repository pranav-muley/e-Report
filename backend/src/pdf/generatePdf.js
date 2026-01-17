// pdf/generatePdf.js
const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const FONT_PATH = path.resolve(
  __dirname,
  "../assets/fonts/NotoSansDevanagari-Regular.ttf"
)

function loadTemplate(type, version) {
  const base = path.join(
    __dirname,
    "templates",
    type.toLowerCase().replace(/_/g, "-"),
    version
  )

  return {
    meta: require(path.join(base, "meta.json")),
    text: require(path.join(base, "text.mr.json")),
    render: require(path.join(base, "layout.js")).render
  }
}

/**
 * mode: "DRAFT" | "ISSUED"
 */
async function generatePdf({ pages, outputPath, mode = "DRAFT" }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 })

      const dir = path.dirname(outputPath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      const stream = fs.createWriteStream(outputPath)
      doc.pipe(stream)

      // Load Marathi font ONCE
      doc.font(FONT_PATH)

      pages.forEach((page, index) => {
        if (index > 0) doc.addPage()

        const template = loadTemplate(page.type, page.version)
        template.render(doc, page.data, template.text)
      })

      doc.end()

      stream.on("finish", () => {
        if (mode === "ISSUED") {
          const buffer = fs.readFileSync(outputPath)
          const hash = crypto
            .createHash("sha256")
            .update(buffer)
            .digest("hex")

          return resolve({
            path: outputPath,
            hash
          })
        }

        resolve({ path: outputPath })
      })

      stream.on("error", reject)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  generatePdf
}