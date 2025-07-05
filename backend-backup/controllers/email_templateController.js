const emailDatalayers = require('../datalayers/email_templateDatalayers');
const errorCodes = require('../helpers/error_codes/errorCodes');


exports.list =async (req,res)=>{
    emailDatalayers.listAll().then((doc)=>{
        res.json({
            msg:"",
            sucess:errorCodes.SUCEESS,
            data:doc
        })
    }).catch((err)=>{
        res.json({
        err: errorsCodes.RESOURCE_NOT_FOUND,
        msg: "",
        error: err,
      });
    })
};


exports.getDetail =async (req,res)=>{
    const id = req.params;
    emailDatalayers.listAll(id).then((doc)=>{
        res.json({
            msg:"",
            sucess:errorCodes.SUCEESS,
            data:doc
        })
    }).catch((err)=>{
        res.json({
        err: errorCodes.RESOURCE_NOT_FOUND,
        msg: "",
        error: err,
      });
    })
};


exports.create = async (req,res)=>{
    
    const params = req.body;

    emailDatalayers.create(params).then((doc)=>{
        res.json({
            msg:"",
            sucess:errorCodes.SUCEESS
        })
    }).catch((err)=>{
        res.json({
        err: errorsCodes.RESOURCE_NOT_FOUND,
        msg: "",
        error: err,
      });
    });  
};


exports.edit = async (req,res)=>{
    const id = req.params.id;
    const param = req.body;

    emailDatalayers.edit(id,param).then((doc)=>{
        res.json({
            msg:"",
            sucess:errorCodes.SUCEESS
        })
    }).catch((err)=>{
        res.json({
        err: errorCodes.RESOURCE_NOT_FOUND,
        msg: "",
        error: err,
      });
    });  
};

exports.delete = async (req,res)=>{
    const id = req.params.id;
    emailDatalayers.delete(id).then((doc)=>{
        res.json({
            msg:"",
            sucess:errorCodes.SUCEESS
        })
    }).catch((err)=>{
        res.json({
        err: errorCodes.RESOURCE_NOT_FOUND,
        msg: "",
        error: err,
      });
    });  
};