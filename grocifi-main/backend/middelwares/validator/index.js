const { validationResult } = require('express-validator');
const { REQUIRED_PARAMETER_MISING } = require('../../helpers/languages/english.js')


const showParametersErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var err = {}
        errors.errors.map((row) => {
            if (err[row.param] == undefined)
                err[row.param] = row.msg
        })

        return res.status(422).json({
            status: false,
            message: REQUIRED_PARAMETER_MISING,
            data: err //errors.array()
        });
    }
    next();
}

module.exports = showParametersErrors;