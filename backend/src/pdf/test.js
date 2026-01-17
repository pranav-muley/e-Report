// testGenerate.js
const { generatePdf } = require("./generatePdf")

generatePdf({
  pages: [
    {
      type: "NOTICE_130",
      version: "v1",
      data: {
        accused: { name: "राम", address: "अकोला" },
        facts: "सार्वजनिक शांततेस बाधा निर्माण केली आहे",
        hearing: { date: "12/01/2026", place: "पोलीस ठाणे" },
        officer: { name: "पोलीस निरीक्षक", designation: "PI" }
      }
    }
  ],
  outputPath: "test.pdf"
})