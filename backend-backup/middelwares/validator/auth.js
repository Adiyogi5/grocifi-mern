const { check } = require('express-validator');
exports.authValidate = (method) => {
    switch (method) {
        case "login":
            {
                return [
                    check("mobile", "Mobile no Required!").exists().not().isEmpty(),
                    check("password", "Password Required!").exists().not().isEmpty(),
                ];
            }
            break;
        case "sendOtp":
            {
                return [
                    check("mobile", "Mobile no Required!").exists().not().isEmpty(),
                ];
            }
            break;
        case "loginWithOtp":
            {
                return [
                    check("mobile", "Mobile no Required!").exists().not().isEmpty(),
                    check("otp", "OTP Required!").exists().not().isEmpty(),
                ];
            }
            break;
        case "resetPassword":
            {
                return [
                    check("mobile", "Mobile no Required!").exists().not().isEmpty(),
                    check("password", "Password Required!").exists().not().isEmpty(),
                    check("otp", "OTP Required!").exists().not().isEmpty(),
                ];
            }
            break;
        case "changePassword":
            {
                return [
                    check("password", "Password Required!").exists().not().isEmpty(),
                    check("new_password", "New Password Required!").exists().not().isEmpty(),
                ];
            }
            break;
        case "updateProfile":
            {
                return [
                    check("fname", "Name Required..!!").exists().not().isEmpty().isLength({ min: 2, max: 50 }),
                    check("lname", "Name Required..!!").exists().not().isEmpty().isLength({ min: 2, max: 50 }),
                    check("email", "Invalid Email..!!").not().isEmpty().isEmail().isLength({ min: 6, max: 50 }),
                    check("mobile", "Mobile Number Required.!!")
                        .exists()
                        .not()
                        .isEmpty()
                        .isLength({ min: 10, max: 10 })
                        .withMessage("10 Digits Required.")
                        .isNumeric()
                        .withMessage("Mobile No Must Be Digits Only."),
                ];
            }
            break;
    }


};