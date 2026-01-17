const { renderCaseFile } = require("./pdf/renderCaseFile")

renderCaseFile(
  {
    pages: [
      {
        pageType: "CASE_FORM",
        templateVersion: "v1",
        data: { /* mock case form data */ }
      },
      {
        pageType: "NOTICE_130",
        templateVersion: "v1",
        data: { /* mock notice data */ }
      }
    ]
  },
  "casefile-test.pdf"
)
