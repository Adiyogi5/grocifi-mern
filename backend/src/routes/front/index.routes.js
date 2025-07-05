const express = require("express");
const router = express.Router();
const { showValidationErrors, authCheckCustomer, licenseCheck, customMethods} = require("../../middelwares");
const checkValid = require("../../middelwares/validator");


router.use(customMethods);

router.use(licenseCheck);

router.use(authCheckCustomer);

router.all("/*", function (req, res) {
  res.status(404).send({
    status: 404,
    message: "API not found",
    data: [],
  });
});

module.exports = router;
