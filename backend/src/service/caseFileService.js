const path = require("path")
const CaseFile = require("../model/caseFile")
const CaseEvent = require("../model/caseEvent")
const { generatePdf } = require("../pdf/generatePdf")
const fs = require("fs")
const Case = require("../model/case")
const Form = require("../model/form")
const Person = require("../model/person")
const { prepareInterimBond125126Data, prepareNotice130Data, prepareAccusedStatementData,
  prepareAccusedBondTimeRequestData, generateCaseRoznamaPage } = require("./formPrepareService")

  async function createCaseFile(caseId, caseFileNumber, pages, issuedBy) {
    if (!caseId) throw new Error("caseId is required")
    if (!caseFileNumber) throw new Error("caseFileNumber is required")
    if (!issuedBy) throw new Error("issuedBy is required")
  
    if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error("At least one page is required to issue CaseFile")
    }
  
    const existing = await CaseFile.findOne({ caseFileNumber })
    if (existing) {
      throw new Error("CaseFile already exists with this number")
    }
  
    // FINAL PDF path
    const outputPath = path.join(
      "storage",
      "casefiles",
      `${caseFileNumber}.pdf`
    )
  
    // Ensure directory exists
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  
    // Normalize pages for DB snapshot
    const normalizedPages = pages.map(p => ({
      type: p.type,
      templateVersion: p.version,
      data: p.data
    }))
  
    // Generate FINAL PDF
    const pdfResult = await generatePdf({
      pages: normalizedPages.map(p => ({
        type: p.type,
        version: p.templateVersion,
        data: p.data
      })),
      outputPath,
      mode: "ISSUED"
    })
  
    // Create immutable CaseFile record
    const caseFile = await CaseFile.create({
      caseId,
      caseFileNumber,
      pages: normalizedPages,
      pdf: {
        path: pdfResult.path,
        hash: pdfResult.hash
      },
      issuedAt: new Date(),
      issuedBy
    })
  
    // Append-only event log
    await CaseEvent.create({
      caseId,
      eventType: "CASEFILE_ISSUED",
      referenceId: caseFile._id,
      performedBy: issuedBy
    })
  
    return caseFile
  }
  

async function previewFormPdf({ formId }) {
  const form = await Form.findById(formId)
  if (!form) throw new Error("Form not found")

  if (form.status !== "DRAFT") {
    throw new Error("Only DRAFT forms can be previewed")
  }

  const caseData = await Case.findById(form.caseId)
  if (!caseData) throw new Error("Case not found")

  let pages = []

  switch (form.formType) {
    case "NOTICE_130": {
      const data = await prepareNotice130Data(form, caseData)
      pages.push({ type: "NOTICE_130", version: "v1", data })
      break
    }

    case "INTERIM_BOND_125_126": {
      const bondPages =
        await prepareInterimBond125126Data(form, caseData)

      bondPages.forEach(p =>
        pages.push({
          type: "INTERIM_BOND_125_126",
          version: "v1",
          data: p
        })
      )
      break
    }

    case "STATEMENT_ACCUSED": {
      const pagesData =
        await prepareAccusedStatementData(form, caseData)

      pagesData.forEach(p =>
        pages.push({
          type: "STATEMENT_ACCUSED",
          version: "v1",
          data: p
        })
      )
      break
    }

    case "ACCUSED_BOND_TIME_REQUEST": {
      const pagesData =
        await prepareAccusedBondTimeRequestData(form, caseData)

      pagesData.forEach(p =>
        pages.push({
          type: "ACCUSED_BOND_TIME_REQUEST",
          version: "v1",
          data: p
        })
      )
      break
    }
    // this is not user filled form its system genrated form.
    // case "CASE_ROZNAMA": {
    //   const data = await generateCaseRoznamaPage(form.caseId)
    //   pages.push({ type: "CASE_ROZNAMA", version: "v1", data })
    //   break
    // }

    default:
      throw new Error("Preview not supported for this form type")
  }
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const outputPath = path.join(
    "tmp",
    "previews",
    `${form._id}-${Date.now()}.pdf`
  )

  await generatePdf({
    pages,
    outputPath,
    mode: "PREVIEW"
  })

  return outputPath
}


async function issueCaseFile({ caseId, caseFileNumber, issuedBy }) {
  // 1. Fetch case
  const caseData = await Case.findById(caseId)
  if (!caseData) throw new Error("Case not found")

  // 2. Fetch APPROVED forms
  const forms = await Form.find({
    caseId,
    status: "APPROVED"
  })

  if (!forms.length) {
    throw new Error("No approved forms found for this case")
  }

  // 3. Build pages IN FIXED ORDER
  const pages = []

  /* =========================
     PAGE 1 — CASE ROZNAMA
     ========================= */
  const roznamaPageData = await generateCaseRoznamaPage(caseId)

  pages.push({
    type: "CASE_ROZNAMA",
    version: "v1",
    data: roznamaPageData
  })

  /* =========================
     PAGE 2+ — FORM PAGES
     ========================= */
  const ORDER = [
    "NOTICE_130",
    "ACCUSED_BOND_TIME_REQUEST",
    "INTERIM_BOND_125_126",
    "STATEMENT_ACCUSED"
  ]

  for (const type of ORDER) {
    const form = forms.find(f => f.formType === type)
    if (!form) continue

    switch (type) {
      case "NOTICE_130": {
        const pageData = await prepareNotice130Data(form, caseData)

        pages.push({
          type: "NOTICE_130",
          version: "v1",
          data: pageData
        })
        break
      }

      case "ACCUSED_BOND_TIME_REQUEST": {
        const requestPages =
          await prepareAccusedBondTimeRequestData(form, caseData)

        requestPages.forEach(pageData => {
          pages.push({
            type: "ACCUSED_BOND_TIME_REQUEST",
            version: "v1",
            data: pageData
          })
        })
        break
      }

      case "INTERIM_BOND_125_126": {
        const bondPages =
          await prepareInterimBond125126Data(form, caseData)

        bondPages.forEach(pageData => {
          pages.push({
            type: "INTERIM_BOND_125_126",
            version: "v1",
            data: pageData
          })
        })
        break
      }

      case "STATEMENT_ACCUSED": {
        const statementPages =
          await prepareAccusedStatementData(form, caseData)

        statementPages.forEach(pageData => {
          pages.push({
            type: "STATEMENT_ACCUSED",
            version: "v1",
            data: pageData
          })
        })
        break
      }

      default:
        break
    }
  }

  /* =========================
     FINAL PDF + DB SNAPSHOT
     ========================= */
  return createCaseFile(
    caseId,
    caseFileNumber,
    pages,
    issuedBy
  )
}

module.exports = {
  createCaseFile,
  prepareNotice130Data,
  previewFormPdf,
  issueCaseFile
}