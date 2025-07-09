const { check } = require("express-validator");
const mongoose = require("mongoose");
module.exports = (method) => {
  switch (method) {
    case "login":
      {
        return [
          check("phone_no", "Phone Number Required!").exists().not().isEmpty(),
          check("password", "Password Required!").exists().not().isEmpty(),
        ];
      }
      break;

    case "updateProfile":
      {
        return [
          check("fname", "First Name is required").exists().notEmpty(),
          check("lname", "Last Name is required").exists().notEmpty(),
          check("email", "Valid Email is required").isEmail().normalizeEmail(),
          check("phone_no", "Phone` Number is required")
            .exists()
            .notEmpty()
            .isMobilePhone(),
        ];
      }
      break;
    case "changePassword":
      {
        return [
          check("password", "Old Password is required!")
            .exists()
            .not()
            .isEmpty(),
          check("new_password", "New Password is required!")
            .exists()
            .not()
            .isEmpty(),
        ];
      }
      break;
    case "Role":
      {
        return [
          check("name").notEmpty().withMessage("Name is required"),
          // check("status", "Status is required and should be boolean.").exists().not().isEmpty(),
        ];
      }
      break;
    case "addSubAdmin":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("password", "Password is required").exists().notEmpty(),
        check("roleId", "Role is required").exists().notEmpty(),
      ];
    case "updateSubAdmin":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("roleId", "Role is required").exists().notEmpty(),
      ];
    case "addFranchise":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("password", "Password is required").exists().notEmpty(),
        check("firmname", "Firm Name is required").exists().notEmpty(),
        check("ownername", "Owner Name is required").exists().notEmpty(),
        check("ownermobile", "Owner Mobile is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("contactpersonname", "Contact Person Name is required")
          .exists()
          .notEmpty(),
        check("contactpersonmob", "Contact Person Mobile is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("commission", "Commission is required")
          .exists()
          .notEmpty()
          .isFloat({ min: 0 }),
      ];
    case "updateFranchise":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("firmname", "Firm Name is required").exists().notEmpty(),
        check("ownername", "Owner Name is required").exists().notEmpty(),
        check("ownermobile", "Owner Mobile is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("contactpersonname", "Contact Person Name is required")
          .exists()
          .notEmpty(),
        check("contactpersonmob", "Contact Person Mobile is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("commission", "Commission is required")
          .exists()
          .notEmpty()
          .isFloat({ min: 0 }),
      ];
    case "addCustomer":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("password", "Password is required").exists().notEmpty(),
      ];
    case "updateCustomer":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
      ];
    case "addWholesaler":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("password", "Password is required").exists().notEmpty(),
        check("wholesaler_firmname", "Firm Name is required").exists().notEmpty(),
        check("gst_no", "GST Number is required").exists().notEmpty(),
      ];
    case "updateWholesaler":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("wholesaler_firmname", "Firm Name is required").exists().notEmpty(),
        check("gst_no", "GST Number is required").exists().notEmpty(),
      ];
    case "addDeliveryBoy":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
        check("password", "Password is required").exists().notEmpty(),
      ];
    case "updateDeliveryBoy":
      return [
        check("fname", "First Name is required").exists().notEmpty(),
        check("lname", "Last Name is required").exists().notEmpty(),
        check("email", "Valid Email is required").isEmail().normalizeEmail(),
        check("phone_no", "Phone Number is required")
          .exists()
          .notEmpty()
          .isMobilePhone(),
      ];
  }
};
