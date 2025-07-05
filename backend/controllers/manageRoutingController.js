const errorsCodes = require('../helpers/error_codes/errorCodes');
const messages = require('../helpers/languages/english');
const groupTypeDatalayers = require('../datalayers/groupTypeDatalayers');


exports.manageRoutingIndex = (req,res,next)=>{
    var userId = req.query.id;
    groupTypeDatalayers.manageRouting(userId).then((data)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:data
        });
    })
    .catch((error)=>{
        res.json({
            err:errorsCodes.BAD_REQUEST,
            msg:"Record not Fetched. Try again.",
            error:error
        });
    });
}