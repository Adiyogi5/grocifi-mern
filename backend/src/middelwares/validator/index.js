const { check } = require("express-validator");
const mongoose = require("mongoose");
module.exports = (method) => {
  switch (method) {
    case "register":
      {
        return [
          check("name", "Name Required..!!")
            .exists()
            .not()
            .isEmpty()
            .isLength({ min: 2, max: 50 }),
          check("email", "Invalid Email..!!")
            .not()
            .isEmpty()
            .isEmail()
            .isLength({ min: 6, max: 50 }),
          check("mobile", "Mobile Number Required.!!")
            .exists()
            .not()
            .isEmpty()
            .isLength({ min: 10, max: 10 })
            .withMessage("10 Digits Required.")
            .isNumeric()
            .withMessage("Mobile No Must Be Digits Only."),
          check("country_id", "Country  Required.!!").exists().not().isEmpty(),
          check("password", "Passowrd  Required.!!")
            .exists()
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage("Min 6 Digits Required."),
        ];
      }
      break;
      
    case "login":
      {
        return [
          check("mobile", "Mobile Number Required!").exists().not().isEmpty(),
          check("password", "Password Required!").exists().not().isEmpty(),
        ];
      }
      break;
  }
};
