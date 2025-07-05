const express = require("express");
const router = express.Router();
const { licenseCheck, errorHandler, customMethods } = require("../middelwares");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


// License Check..
router.use(customMethods);
router.use(licenseCheck);



router.use("/admin/", require("./admin/index.routes"));

// Application Error handler
router.use(errorHandler);

// 404 API not found
router.all("*", function (req, res) {
  res.status(404).send({ status: 404, message: "API not found", data: [] });
});

module.exports = router;
