const { validationResult } = require('express-validator');
const authCheckAdmin = require("./authCheckAdmin");
const licenseCheck = require("./licenseCheck");
const errorHandler = require("./errorHandler");
const customMethods = require("./customMethods");
const authCheckCustomer = require("./authCheckCustomer");

const { REQUIRED_PARAMETER_MISING } = require('../languages/english');

const showValidationErrors = (req, res, next) => {
    // Fetch Express Validation Errors
    const errors = validationResult(req);
    // Append File validation Error
    if (req.fileError) { errors.errors.push(req.fileError) }
          
    if (req.fileValidationError) { 
        return res.status(422).json({
            status: false,
            message: "Image Size More then limit",
            data: req.fileValidationError //errors.array()
        });
     }

    // Format Express Validation Errors
    if (!errors.isEmpty()) {
        var errJson = errors.errors.filter((row) => row.path).reduce((acc, row) => {
            acc[row.path] = row.msg;
            return acc;
        }, {});
        
        return res.status(422).json({
            status: false,
            message: REQUIRED_PARAMETER_MISING,
            data: errJson //errors.array()
        });
    }

    next();
}

module.exports = { authCheckAdmin, authCheckCustomer, customMethods, licenseCheck, showValidationErrors, errorHandler };