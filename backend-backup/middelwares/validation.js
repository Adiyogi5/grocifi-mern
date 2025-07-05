const errorMessage = require("../helpers/error_codes/errorCodes");
const messageLangauage = require("../helpers/languages/english");


exports.licenceKeyRequire = (req, res, next) => {
  const licencekey = req.headers["x-api-key"];
  
  if (licencekey === "1075639381c06bf6eb05c99b01ca0eedb09b9e79dec52b55af6084a6") {
    next();
  } else {
    res.json({
      sucess: errorMessage.BAD_REQUEST,
      message: messageLangauage.LICENSE_MISSING,
      data: {},
    });
  }
};






