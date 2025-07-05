const catagoryDatalayer = require("../datalayers/catagoryDatalayers");
const catagoryModel = require("../modules/Catagory");
const franchisecatagoryModel = require("../modules/FranchiseCategory");
const message = require("../helpers/languages/english");
const errorMessage = require("../helpers/error_codes/errorCodes");
const { check, validationResult } = require("express-validator");
const mongodb = require("mongoose");
const fs = require("fs");

exports.getAllCatagories = async(req, res) => {
    const param = req.query; //Getting title param to search
    if (param._id == undefined) {
        param.catagory_id = null;
        catagoryDatalayer.getAllCatagories(param)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
    } else {
        catagoryDatalayer.getAllCatagories(param)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
    }
};

exports.getCatagoriesList = async(req, res) => {
        let params = {skip: 0, limit: 0 }; 
        let where = {};  
        var total = await catagoryDatalayer.gettotalCatagory(where);         
        if(req.query.start){
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
            params.order = req.query.order;
            params.dir = parseInt(req.query.dir); 
        }else{
            where = req.query;
        } 
        if(req.query.where){
            where = {
                    "$or": [{
                        "title" : {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                    }, {
                        "mainCategory": {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                    }]
                };  
        }        
        var filtered = await catagoryDatalayer.gettotalCatagory(where);
        catagoryDatalayer
            .getCatagoriesList(where, params)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                    total: total,
                    filtered: filtered,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
};

exports.uploadCatImg = async(req, res) => {

    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/catagory_img/" + req.file.filename;
    fs.renameSync( srcPath, destPath);

    res.json({
        sucess: errorMessage.SUCEESS,
        name: req.file.filename
    });
}

exports.updatesynccat = async(req, res) => {
    const cat = req.body.cat;
    let user = req.user;
    if(cat){
        cat.forEach( async(element, index, array) => { 
           //// console.log(element.id);
            var where = {catcode:element.id};
            catexist = await catagoryDatalayer.getCatagorybyCatcode(where); 
            if(catexist==''){ 
                ///Save New Category
                param = { 
                    catcode:element.id, 
                    title:element.name, 
                    description:element.description, 
                    catagory_img:'',
                    priority:1,
                    createdby:user._id, 
                    modifiedby:user._id,
                    created:element.created, 
                    modified:element.modified           
                };
                catagoryModel.create(param)
                .then((doc) => {  
                    fdata = {
                            'franchiseId': mongodb.Types.ObjectId(element.franchise_id),
                            'catId': mongodb.Types.ObjectId(doc['_id']),  
                            'is_active':'1',
                            'created':element.created, 
                            'modified':element.modified,
                            'createdby': user._id, 
                            'modifiedby': user._id,
                        };  
                        franchisecatagoryModel.create(fdata)
                            .then((fracategory) => {
                                ////nothing
                            });
                })
                .catch((err) => { 
                    ////nothing
                }); 
            } 
        });
        res.json({
            message: message.SUCCESS,
            sucess: errorMessage.SUCEESS,
            data: "",
        }); 
    }else{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            code: errorMessage.BAD_REQUEST,
            error: `Catagory Data not found`,
        });
    }

}

exports.save = async(req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.json({
            sucess: errorMessage.BAD_REQUEST,
            msg: validation.errors[0].msg,
            error: validation,
        });
        return;
    }
    const param = req.body;
    if (req.file == undefined && req.body.cat_image == undefined) {
        param.catagory_img = "No Image";
    } else {
        if (req.body.cat_image != undefined) {
            param.catagory_img = req.body.cat_image;
        } else {
            param.catagory_img = req.file.filename;
        }
    }
    catagoryDatalayer.getAllCatagories({}).then((doc) => {
        //Checking Condition Where Catagory Already Present In the Database
        const condition = doc.filter((element) => {
            return element.title === param.title.toLowerCase().trim();
        });
        if (!condition[0]) {
            catagoryDatalayer.save(param)
                .then((docm) => {
                    res.json({
                        message: message.SUCCESS,
                        sucess: errorMessage.SUCEESS,
                        data: docm,
                    });
                })
                .catch((err) => {
                    res.json({
                        message: message.SOMETHING_WENT_WRONG,
                        code: errorMessage.BAD_REQUEST,
                        error: "DataBase Error",
                        err: err,
                    });
                });
        } else {
            res.json({
                message: message.SOMETHING_WENT_WRONG,
                code: errorMessage.BAD_REQUEST,
                error: `Data Already Created In Catagory`,
            });
        }
    });
};


exports.getcatdetailbyslug = async(req, res) => {
    const param = req.params;  
    catagoryDatalayer.getCatagoryBySlug(param.catagoryslug)
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });  
};

exports.edit = async(req, res) => {

    const param = req.params;  
    catagoryDatalayer.getCatagoryById(param.catagoryId)
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });  
};

exports.update = async(req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.json({
            sucess: errorMessage.BAD_REQUEST,
            msg: validation.errors[0].msg,
            error: validation,
        });
        return;
    }
    
    catagoryDatalayer.edit(req.body)
        .then((doc) => {
            ////console.log(doc);
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.status = (req, res) => {
    catagoryDatalayer.status(mongodb.Types.ObjectId(req.body._id), req.body)
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                err: errorMessage.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.deletecatagory = async(req, res) => {
    const id = req.params.id;

    catagoryDatalayer.delete(id)
        .then((doc) => {
            res.json({
                message: message.SUCCESS,
                sucess: errorMessage.SUCEESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                message: message.SOMETHING_WENT_WRONG,
                err: errorMessage.BAD_REQUEST,
                error: err,
            });
        });
};

exports.logicalDelete = (req, res) => {
    var values = req.params;
    var id = values.catagoryid;
    var param = {
        is_active: values.is_active,
    };
    // console.log(param);

    if (
        values.is_active == "0" ||
        values.is_active == "1" ||
        values.is_active == "2"
    ) {
        catagoryDatalayer
            .edit(id, param)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
    } else {
        res.json({
            code: errorMessage.BAD_REQUEST,
            msg: "Invalid Procedure use only 1 2 or 0 ",
        });
    }
};

exports.statusAll = async(req, res) => {
    const is_active = { "is_active": req.body.is_active };
    const idArr = [];

    if (req.body.productIds && req.body.productIds.length > 0) {
        req.body.productIds.forEach(_id => {
            idArr.push(mongodb.Types.ObjectId(_id));
        });
    } else {
        return false;
    }
    catagoryDatalayer.statusAll(idArr, is_active)
        .then((product) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorMessage.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        })

};


exports.getAllSubCatagories = async(req, res) => {
    const param = req.params; //Getting title param to search
    const condition = req.query;

    if (condition.is_active === undefined) {
        catagoryDatalayer
            .getAllCatagories(param)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
    } else {
        let cond = {};
        cond.is_active = condition.is_active;
        cond.catagory_id = param.catagory_id;
        // console.log(cond);
        catagoryDatalayer
            .getAllCatagories(cond)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
    }
};

exports.editsubCatagory = async(req, res) => {
    const param = req.body;
    const id = req.params.id;
    ///console.log(param, id);
    catagoryDatalayer
        .edit(id, param)
        .then((doc) => {
            res.json({
                message: message.SUCCESS,
                sucess: errorMessage.SUCEESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                message: message.SOMETHING_WENT_WRONG,
                err: errorMessage.BAD_REQUEST,
                error: err,
            });
        });
};

exports.deletesubCatagory = async(req, res) => {
    const id = req.params.id;
    ////console.log(id);

    catagoryDatalayer
        .delete(id)
        .then((doc) => {
            res.json({
                message: message.SUCCESS,
                sucess: errorMessage.SUCEESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                message: message.SOMETHING_WENT_WRONG,
                err: errorMessage.BAD_REQUEST,
                error: err,
            });
        });
};

exports.logicalDeleteSubCatagory = async(req, res) => {
    var values = req.params;
    var id = values.subCatagoryId;
    var param = {
        is_active: values.is_active,
    };
    // console.log(id,param);

    if (
        values.is_active == "0" ||
        values.is_active == "1" ||
        values.is_active == "2"
    ) {
        catagoryDatalayer
            .edit(id, param)
            .then((doc) => {
                res.json({
                    message: message.SUCCESS,
                    sucess: errorMessage.SUCEESS,
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    message: message.SOMETHING_WENT_WRONG,
                    err: errorMessage.BAD_REQUEST,
                    error: err,
                });
            });
    } else {
        res.json({
            code: errorMessage.BAD_REQUEST,
            msg: "Invalid Procedure use only 1 2 or 0 ",
        });
    }
};

exports.catagoryAndSubCatagoryDetails = async(req, res) => {
    const condition = {}; //[{ _id: req.params.id }, { catagory_id: req.params.id }];

    catagoryDatalayer.subcatagorycatagorydetails(condition)
        .then((doc) => {
            res.json({
                message: message.SUCCESS,
                sucess: errorMessage.SUCEESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                message: message.SOMETHING_WENT_WRONG,
                err: errorMessage.BAD_REQUEST,
                error: err,
            });
        });
};

exports.getAllCatagoryList = async(req, res) => {
    var catId = ''; 
    catagoryDatalayer.getAllCatagoryList( )
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getParentList = async(req, res) => {
    var catId = null;
    catagoryDatalayer.getCatagoryList(catId)
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
}


exports.getCatagoryList = async(req, res) => {
    var catId = '';
    if (req.params.catId != undefined) {
        catId = mongodb.Types.ObjectId(req.params.catId);
    }
    catagoryDatalayer.getCatagoryList(catId)
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getCatagoryById = async(req, res) => {
    catagoryDatalayer.getCatagoryById(mongodb.Types.ObjectId(req.params.catId))
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                err: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getCatsWithProductCount = async(req, res) => {
    try {
        let products_cates = await catagoryDatalayer.getCatsWithProducts();
        let total_product = 0;
        if (products_cates.length > 0) {
            products_cates.forEach((ele, i) => {
                products_cates[i].products = ele.products.length;
                total_product += Number(products_cates[i].products);
            });
        }

        res.json({
            sucess: errorMessage.SUCEESS,
            msg: message.SUCCESS,
            data: products_cates,
            total_product: total_product
        });

    } catch (e) {
        res.json({
            sucess: errorMessage.BAD_REQUEST,
            err: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            error: err,
        });
    } 
}

exports.validation = (method) => {
    switch (method) {
        case "savecategory":
            {
                return [
                    check("slug", "")
                    .custom(async(slug, { req }) => {
                        if (slug) {
                        return catagoryDatalayer.findbyField({ slug })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`SEO URL "${slug}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                        }
                    })
                ];
            }  
        case "updatecategory":
            {  
                return [
                    check("slug", "")
                    .custom(async(slug, { req }) => {
                        if (slug) {
                        return catagoryDatalayer.findbyField({ _id: { $ne: mongodb.Types.ObjectId(req.body._id) }, slug: slug })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`SEO URL "${slug}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                        }
                    })
                ];
            }    
    }
};