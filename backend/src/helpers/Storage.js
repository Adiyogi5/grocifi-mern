const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  SUPPORTED_FORMATS_IMAGE,
  SUPPORTED_FORMATS_DOC,
} = require("./formValidConfig");

const fileFilter = (req, file, cb,isImage, isDoc, maxAllowSize) => {
  // Check uploaded file not exceed permitted size.
  const reqSize = parseInt(req.headers["content-length"]);

  
  if (reqSize && reqSize > maxAllowSize) {
    req.fileValidationError = {
      [file.fieldname]: "Uploaded file is too large to upload..!!",
    };
    return cb(
      null,
      false,
      new Error("Uploaded file is too large to upload..!!")
    );
  }

  // Check uploaded file is image.
  // Allow any image format except those in SUPPORTED_FORMATS_DOC
  if (isImage && SUPPORTED_FORMATS_DOC.includes(file.mimetype)) {
    req.fileValidationError = {
      [file.fieldname]: "This document format is not allowed for images.",
    };
    return cb(
      null,
      false,
      new Error("This document format is not allowed for images.")
    );
  }

  // Check uploaded file is Document.
  if (isDoc && !SUPPORTED_FORMATS_DOC.includes(file.mimetype)) {
    req.fileValidationError = {
      [file.fieldname]: "Please select document file Only..!!",
    };
    return cb(null, false, new Error("Please select document file Only..!!"));
  }

  cb(null, true);
};

exports.uploadTo = class {
  constructor({
    dir = "admins",
    isImage = false,
    isDoc = false,
    fileSize = 2,
  }) {
    const maxAllowSize = fileSize * Math.pow(1024, 10);

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let pathToSave = `public/uploads/${dir}`;
        fs.mkdirSync(pathToSave, { recursive: true });
        return cb(null, pathToSave);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null, file.fieldname + "-" + uniqueSuffix);
      },
    });

    this.upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxAllowSize },
    });
  }

  single(fieldName = "image") {
    return this.upload.single(fieldName);
  }

  array(fieldName = "image", maxCount = 5) {
    return this.upload.array(fieldName, maxCount);
  }
  fields(fieldsArray) {
    return this.upload.fields(fieldsArray);
  }
  any() {
    return this.upload.any();
  }
};

exports.deleteFile = (deleteFile) => {
  try {
    if (deleteFile === null || deleteFile == undefined) return true;

    deleteFile = deleteFile.replaceAll(`${process.env.BASEURL}/uploads/`, "");
    console.log(deleteFile);
    if (
      ![
        "users/avatar.png",
        "admins/avatar.png",
        "vendors/avatar.png",
        "customers/avatar.png",
        "products/product-placeholder.png",
        "product-categories/product-placeholder.png",
        "404-file-not-found.jpg",
      ].includes(deleteFile)
    ) {
      if (fs.existsSync(`public/uploads/` + deleteFile)) {
        fs.unlinkSync(`public/uploads/` + deleteFile);
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Example multiUpload instance for handling multiple file fields, with per-field directory support.
 * You can import this in your route files as needed.
 * 
 * Usage example in your route:
 * router.post('/franchise/edit/:id', Storage.multiUpload.fields([
 *   { name: 'image', maxCount: 1, dir: 'franchise/images' },
 *   { name: 'logo', maxCount: 1, dir: 'franchise/logos' }
 * ]));
 */
exports.multiUpload = new (class {
    constructor({
        dir = "admins",
        isImage = false,
        isDoc = false,
        fileSize = 2,
    } = {}) {
        const maxAllowSize = fileSize * Math.pow(1024, 2); // 2MB default

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                // Find the field config from req._fieldsConfig
                let fieldConfig = (req._fieldsConfig || []).find(f => f.name === file.fieldname);
                let subDir = fieldConfig && fieldConfig.dir ? fieldConfig.dir : `${dir}/${file.fieldname}`;
                let pathToSave = `public/uploads/${subDir}`;
                fs.mkdirSync(pathToSave, { recursive: true });
                return cb(null, pathToSave);
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = `${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}${path.extname(file.originalname)}`;
                cb(null, file.fieldname + "-" + uniqueSuffix);
            },
        });

        this.upload = multer({
            storage,
            fileFilter: (req, file, cb) => fileFilter(req, file, cb, isImage, isDoc, maxAllowSize),
            limits: { fileSize: maxAllowSize },
        });
    }

    /**
     * Accepts fieldsArray with optional 'dir' property for each field.
     * Example: [{ name: 'image', maxCount: 1, dir: 'franchise/images' }]
     */
    fields(fieldsArray) {
        // Attach fields config to req for use in storage.destination
        return (req, res, next) => {
            req._fieldsConfig = fieldsArray;
            this.upload.fields(fieldsArray)(req, res, next);
        };
    }

    single(fieldName = "image") {
        return this.upload.single(fieldName);
    }

    array(fieldName = "image", maxCount = 5) {
        return this.upload.array(fieldName, maxCount);
    }
    any() {
        return this.upload.any();
    }
})();
