// src/controller/personController.js
const Person = require("../model/person");
const Case = require("../model/case");
const { uploadFile, deleteFile } = require("../service/fileUploadService");

async function createPerson(req, res, next) {
  try {
    const { caseId } = req.params;
    const { name, role, address, age, gender, mobile } = req.body;

    console.log("=== createPerson Debug ===");
    console.log("Body:", { name, role, address, age, gender, mobile });
    console.log("req.files:", req.files);
    console.log("req.files keys:", req.files ? Object.keys(req.files) : "none");

    const existingCase = await Case.findById(caseId);
    if (!existingCase) return res.status(404).json({ message: "Case not found" });

    // optional files from multer.fields()
    const signatureFile = req.files?.signature?.[0];
    const photoFile = req.files?.photo?.[0];
    const documentFile = req.files?.document?.[0];

    console.log("Files extracted:");
    console.log("photoFile:", photoFile?.originalname, photoFile?.size);
    console.log("signatureFile:", signatureFile?.originalname, signatureFile?.size);
    console.log("documentFile:", documentFile?.originalname, documentFile?.size);

    // 1) create person first
    const person = await Person.create({
      caseId,
      name,
      role,
      address,
      age,
      gender,
      mobile,
      files: {},
    });

    const uploadOne = async (file, folder) => {
      try {
        const ext =
          file.mimetype === "application/pdf"
            ? "pdf"
            : file.mimetype.split("/")[1] || "bin";
    
        const path = `persons/${folder}/${person._id}.${ext}`;
    
        console.log(`Uploading ${folder}:`, path);
        await uploadFile({
          buffer: file.buffer,
          path,
          contentType: file.mimetype,
        });
        console.log(`Successfully uploaded ${folder}`);
        return path;
      } catch (err) {
        console.error(`Error uploading ${folder}:`, err);
        // Don't fail the whole request if a file upload fails
        return null;
      }
    };

    // 2) upload only what is present
    if (signatureFile) person.files.signature = await uploadOne(signatureFile, "signatures");
    if (photoFile) person.files.photo = await uploadOne(photoFile, "photos");
    if (documentFile) person.files.document = await uploadOne(documentFile, "documents");

    console.log("Saving person with files:", person.files);
    // 3) save updated file paths
    await person.save();

    return res.status(201).json({
      success: true,
      personId: person._id,
      files: person.files,
    });
  } catch (err) {
    console.error("Error in createPerson:", err);
    next(err);
  }
}

async function updatePerson(req, res, next) {
  try {
    const { personId } = req.params;

    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ message: "Person not found" });

    // update text fields (only if provided)
    const { name, role, address, age, gender, mobile } = req.body;

    if (name !== undefined) person.name = name;
    if (role !== undefined) person.role = role;
    if (address !== undefined) person.address = address;
    if (age !== undefined) person.age = age;
    if (gender !== undefined) person.gender = gender;
    if (mobile !== undefined) person.mobile = mobile;

    // optional files
    const signatureFile = req.files?.signature?.[0];
    const photoFile = req.files?.photo?.[0];
    const documentFile = req.files?.document?.[0];

    person.files = person.files || {};

    const uploadOne = async (file, folder) => {
      const ext =
        file.mimetype === "application/pdf"
          ? "pdf"
          : file.mimetype.split("/")[1] || "bin";

      const path = `persons/${folder}/${person._id}.${ext}`;

      await uploadFile({
        buffer: file.buffer,
        path,
        contentType: file.mimetype,
      });

      return path;
    };

    if (signatureFile) {
      person.files.signature = await uploadOne(signatureFile, "signatures");
    }

    if (photoFile) {
      person.files.photo = await uploadOne(photoFile, "photos");
    }

    if (documentFile) {
      person.files.document = await uploadOne(documentFile, "documents");
    }

    await person.save();

    return res.json({
      success: true,
      message: "Person updated",
      person,
    });
  } catch (err) {
    next(err);
  }
}

async function deletePerson(req, res, next) {
  try {
    const { personId } = req.params;

    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ message: "Person not found" });

    const paths = [
      person.files?.signature,
      person.files?.photo,
      person.files?.document,
    ].filter(Boolean);

    await Promise.all(paths.map((p) => deleteFile(p)));

    await Person.findByIdAndDelete(personId);

    return res.json({ success: true, message: "Person deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPerson, updatePerson, deletePerson };