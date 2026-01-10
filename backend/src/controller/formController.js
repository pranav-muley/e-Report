const Form = require("../model/form")

async function createForm(req, res, next) {
    try {
        const { caseId } = req.params
        const { formType, content } = req.body

        const form = await Form.create({
            caseId,
            formType,
            content,
            createdBy: req.user.id
        })

        res.status(201).json({
            success: true,
            formId: form._id,
            status: form.status
        })
    } catch (err) {
        next(err)
    }
}


// Update draft form
async function updateForm(req, res, next) {
    try {
        const { formId } = req.params
        const { content } = req.body

        const form = await Form.findOne({
            _id: formId,
            createdBy: req.user.id
        })

        if (!form) {
            return res.status(404).json({ message: "Form not found" })
        }

        if (form.status !== "DRAFT") {
            return res.status(400).json({ message: "Form is not editable" })
        }

        form.content = content
        await form.save()

        res.json({ success: true })
    } catch (err) {
        next(err)
    }
}


// Submit form
async function submitForm(req, res, next) {
    try {
        const { formId } = req.params

        const form = await Form.findOne({
            _id: formId,
            createdBy: req.user.id
        })

        if (!form) {
            return res.status(404).json({ message: "Form not found" })
        }

        if (form.status !== "DRAFT") {
            return res.status(400).json({ message: "Form already submitted" })
        }

        form.status = "SUBMITTED"
        await form.save()

        res.json({ success: true })
    } catch (err) {
        next(err)
    }
}

async function getFormsByCase(req, res, next) {
    try {
        const { caseId } = req.params

        const forms = await Form.find({
            caseId,
            createdBy: req.user.id
        })
            .sort({ createdAt: -1 })
            .select("formType status createdAt")

        res.json({
            success: true,
            forms
        })
    } catch (err) {
        next(err)
    }
}

async function getFormById(req, res, next) {
    try {
        const { formId } = req.params

        const form = await Form.findOne({
            _id: formId,
            createdBy: req.user.id
        }).populate("caseId", "branchCaseNumber sections")

        if (!form) {
            return res.status(404).json({ message: "Form not found" })
        }

        res.json({
            success: true,
            form
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    createForm,
    updateForm,
    submitForm,
    getFormsByCase,
    getFormById
}