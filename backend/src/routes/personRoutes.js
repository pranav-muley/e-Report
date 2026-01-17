const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const { updatePerson, deletePerson, createPerson } = require("../controller/personController");

const {
  uploadSignature,
  uploadPhoto,
  uploadDocument,
  getPersonFile,
} = require("../controller/personFileController");

router.use(auth);

router.post(
  "/cases/:caseId/persons",
  uploadMiddleware.uploadPersonFiles,
  createPerson
);

router.put(
  "/persons/:personId",
  uploadMiddleware.uploadPersonFiles,
  updatePerson
);

router.delete("/persons/:personId", deletePerson);

router.post(
  "/persons/:personId/upload/signature",
  uploadMiddleware.uploadSignature,
  uploadSignature
);

router.post(
  "/persons/:personId/upload/photo",
  uploadMiddleware.uploadPhoto,
  uploadPhoto
);

router.post(
  "/persons/:personId/upload/document",
  uploadMiddleware.uploadDocument,
  uploadDocument
);

/**
 * Get signed URL for a person's file
 * :type must be one of: signature | photo | document
 */
router.get("/persons/:personId/files/:type", getPersonFile);

module.exports = router;