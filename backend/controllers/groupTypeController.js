const errorCodes = require('../helpers/error_codes/errorCodes');
const messages = require('../helpers/languages/english');
const groupTypeDatalayers = require('../datalayers/groupTypeDatalayers');


exports.listAll = async (req, res) => {
    const condition = req.query;
    groupTypeDatalayers.listAll(condition).then((data) => {
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: messages.SUCCESS,
            data: data
        })
    }).catch((err) => {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: messages.SOMETHING_WENT_WRONG,
            error: {
                err
            }
        })

    })
}

exports.save = async(req,res)=>{
    groupTypeDatalayers.create(req.body).then((data) => {
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: messages.SUCCESS,
            data: data
        })
    }).catch((err) => {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: messages.SOMETHING_WENT_WRONG,
            error: {
                err
            }
        })

    })
}

exports.edit= async(req,res)=>{
    const id = req.params.Id;
    const body = req.body;
    groupTypeDatalayers.edit(id,body).then((data) => {
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: messages.SUCCESS,
            data: data
        })
    }).catch((err) => {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: messages.SOMETHING_WENT_WRONG,
            error: {
                err
            }
        })

    })
}
exports.delete= async(req,res)=>{
    const id = req.params.Id;
    groupTypeDatalayers.delete(id).then((data) => {
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: messages.SUCCESS,
            data: data
        })
    }).catch((err) => {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: messages.SOMETHING_WENT_WRONG,
            error: {
                err
            }
        })

    })
}



