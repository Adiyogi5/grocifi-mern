const errorCode = require('../helpers/error_codes/errorCodes');
const {check, validationResult } = require('express-validator');


const uservalidationResult = ()=>{
    return [
        check('email').isEmail().withMessage('Value Should Be Email'),
        check('mobile_no').isLength({min:10,max:10}).withMessage('Only 10 Digits Number Allowed'),
        check('from_email').isEmail().withMessage('Email Value Required'),
        check('reply_email').isEmail().withMessage('Email Value Required'),
    ]
};


const validate = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors);
    if (errors.isEmpty()) {
      return next()
    }
    // const extractedErrors = []
    // errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.json({
      sucess:errorCode.BAD_REQUEST,
        msg: errors,
    })
  }
  
  module.exports = {
    uservalidationResult,
    validate,
  }