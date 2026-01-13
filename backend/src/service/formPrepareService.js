const Person = require("../model/person")
const Case = require("../model/case")
const Form = require("../model/form")
const PoliceStation = require("../model/policestation")

async function prepareInterimBond125126Data(form, caseData) {
    const content = form.content.mr

    // 1. Fetch accused persons
    const accusedPersons = await Person.find({
        _id: { $in: content.accusedPersonIds },
        caseId: form.caseId,
        role: "DEFENDANT"
    })

    if (!accusedPersons.length) {
        throw new Error("No valid defendants found for bond")
    }

    // 2. Build one page per accused
    return accusedPersons.map(accused => ({
        accused: {
            name: accused.name,
            address: accused.address,
            age: accused.age
        },

        bond: {
            amount: content.bond.amount,
            durationMonths: content.bond.durationMonths,
            condition: content.bond.condition
        },

        validity: content.validity,

        executionDate: content.executionDate,

        sureties: content.sureties || [],

        officer: {
            designation: "विशेष कार्यकारी दंडाधिकारी",
            office: caseData.officeName
        }
    }))
}

async function prepareNotice130Data(form, caseData) {
    // 1. Fetch persons by IDs
    const persons = await Person.find({
        _id: { $in: form.content.mr.accusedPersonIds },
        caseId: form.caseId,
        role: "DEFENDANT"
    })

    if (!persons.length) {
        throw new Error("No valid defendants found")
    }

    // 2. Map to printable structure
    const accusedPersons = persons.map(p => ({
        name: p.name,
        address: p.address
    }))

    // 3. Build final data object for template
    return {
        caseNumber: caseData.branchCaseNumber,
        caseDate: new Date().toLocaleDateString("mr-IN"),

        policeStationName: caseData.policeStationName,

        accusedPersons,

        facts: form.content.mr.facts,
        bond: form.content.mr.bond,
        hearing: form.content.mr.hearing,

        officer: {
            name: caseData.officerName,
            designation: caseData.officerDesignation,
            office: caseData.officeName
        }
    }
}

async function prepareAccusedStatementData(form, caseData) {
  const content = form.content.mr

  if (!Array.isArray(content.accusedPersonIds) || !content.accusedPersonIds.length) {
    throw new Error("accusedPersonIds are required for STATEMENT_ACCUSED")
  }

  // 1. Fetch accused persons
  const accusedPersons = await Person.find({
    _id: { $in: content.accusedPersonIds },
    caseId: form.caseId,
    role: "DEFENDANT"
  })

  if (!accusedPersons.length) {
    throw new Error("No valid defendants found for statement")
  }

  // 2. Build one page per accused
  return accusedPersons.map(accused => ({
    accused: {
      name: accused.name,
      address: accused.address,
      age: accused.age,
      education: accused.education,
      occupation: accused.occupation
    },

    answers: {
      noticeReceived: !!content.answers.noticeReceived,
      understandsNotice: !!content.answers.understandsNotice,
      agreesToMaintainPeace: !!content.answers.agreesToMaintainPeace
    },

    statementDate: content.statementDate,

    place: caseData.officeName || "—",

    officer: {
      designation: "विशेष कार्यकारी दंडाधिकारी",
      office: caseData.officeName
    }
  }))
}

async function prepareAccusedBondTimeRequestData(form, caseData) {
  const content = form.content.mr

  if (!content.accusedPersonIds || !content.accusedPersonIds.length) {
    throw new Error("accusedPersonIds required for ACCUSED_BOND_TIME_REQUEST")
  }

  // Fetch accused persons
  const accusedPersons = await Person.find({
    _id: { $in: content.accusedPersonIds },
    caseId: form.caseId,
    role: "DEFENDANT"
  })

  if (!accusedPersons.length) {
    throw new Error("No valid accused found for bond time request")
  }

  // One page per accused
  return accusedPersons.map(accused => ({
    accused: {
      name: accused.name,
      address: accused.address
    },

    applicationDate: content.applicationDate,

    place: caseData.officeName || "—"
  }))
}

async function generateCaseRoznamaPage(caseId) {
  if (!caseId) throw new Error("caseId is required")

  // 1️⃣ Fetch case
  const caseData = await Case.findById(caseId)
  if (!caseData) throw new Error("Case not found")

  // 2️⃣ Fetch police station
  const policeStation = await PoliceStation.findById(
    caseData.policeStationId
  )
  if (!policeStation) throw new Error("Police station not found")

  // 3️⃣ Fetch roznama form (must exist)
  const roznamaForm = await Form.findOne({
    caseId,
    formType: "CASE_ROZNAMA",
    status: { $in: ["DRAFT", "APPROVED"] }
  })
  if (!roznamaForm) {
    throw new Error("CASE_ROZNAMA form not found")
  }

  // 4️⃣ Fetch persons
  const persons = await Person.find({ caseId })

  const complainant = persons.find(p => p.role === "APPLICANT")
  const allDefendants = persons.filter(p => p.role === "DEFENDANT")

  // 5️⃣ Build entries with resolved present accused
  const entries = roznamaForm.content.mr.entries.map(entry => {
    const presentAccused = allDefendants.filter(d =>
      entry.presentAccusedPersonIds.includes(String(d._id))
    )

    return {
      date: new Date(entry.date).toLocaleDateString("mr-IN"),
      proceedings: entry.proceedings,
      nextDate: entry.nextDate
        ? new Date(entry.nextDate).toLocaleDateString("mr-IN")
        : "-",
      presentAccused: presentAccused.map(p => ({
        name: p.name
      }))
    }
  })

  // 6️⃣ FINAL PAGE DATA (what layout.js expects)
  return {
    caseInfo: {
      branchCaseNumber: caseData.branchCaseNumber,
      policeCaseNumber: caseData.policeStationCaseNumber,

      policeStation: policeStation.name,
      policeStationCode: policeStation.code,

      sections: caseData.sections,

      complainant: complainant
        ? {
            name: complainant.name,
            address: complainant.address
          }
        : null,

      defendants: allDefendants.map(d => ({
        name: d.name
      }))
    },

    entries,

    officer: {
      office: policeStation.district
    }
  }
}

module.exports = {
    generateCaseRoznamaPage,
    prepareInterimBond125126Data,
    prepareNotice130Data,
    prepareAccusedStatementData,
    prepareAccusedBondTimeRequestData,
}