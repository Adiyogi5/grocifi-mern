const franchiseproductModel = require("../modules/FrProducts");
const frproductvariantsModel = require("../modules/FrProductVariants");


exports.gettotalfrproducts = async(where) => {
    return new Promise((res, rej) => {
        if (where) {
            franchiseproductModel.aggregate([{
                    $lookup: {
                        "from": "products",
                        "localField": "productId",
                        "foreignField": "_id",
                        "as": "product"
                    }
                }, {
                    "$unwind": {
                        "path": "$product",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                { $match: where }
            ]).then((product) => {
                res(product.length);
            }).catch((error) => {
                rej(error);
            });
        } else {
            franchiseproductModel.countDocuments(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};


exports.getAllfrProducts = (where, params) => {
    return new Promise((res, rej) => {
        if (params.limit == 0) {
            franchiseproductModel.aggregate([{
                        $match: where
                    },
                    {
                        $lookup: {
                            from: "frproductvariants",
                            as: "productvariants",
                            localField: "_id",
                            foreignField: "frproductId"
                        }
                    },
                    {
                        $lookup: {
                            "from": "products",
                            "localField": "productId",
                            "foreignField": "_id",
                            "as": "product"
                        }
                    },
                    {
                        $lookup: {
                            "from": "productimages",
                            "localField": "productId",
                            "foreignField": "productId",
                            "as": "pimgs"
                        }
                    },
                    {
                        $unwind: {
                            "path": "$product"
                        }
                    },
                    {
                        $sort: { priority: 1 }
                    }
                ])
                .then((products) => {
                    res(products);
                })
                .catch((error) => {
                    rej(error);
                });
        } else {
            franchiseproductModel.aggregate([{
                        $lookup: {
                            from: "frproductvariants",
                            as: "productvariants",
                            localField: "_id",
                            foreignField: "frproductId"
                        }
                    },
                    {
                        $lookup: {
                            "from": "products",
                            "localField": "productId",
                            "foreignField": "_id",
                            "as": "product"
                        }
                    },
                    {
                        $lookup: {
                            "from": "productimages",
                            "localField": "productId",
                            "foreignField": "productId",
                            "as": "pimgs"
                        }
                    },
                    {
                        $unwind: {
                            "path": "$product"
                        }
                    },
                    { $match: where },
                    {
                        $sort: {
                            [params.order]: params.dir
                        }
                    },
                    { $skip: params.skip },
                    { $limit: params.limit }
                ])
                .then((products) => {
                    res(products);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getfranchiseProduct = (fId) => {
    return new Promise((res, rej) => {
        //franchiseproductModel.find(where)
        franchiseproductModel.aggregate([{
                    $match: { franchiseId: fId }
                },
                {
                    $lookup: {
                        "from": "products",
                        "localField": "productId",
                        "foreignField": "_id",
                        "as": "product"
                    }
                },
                {
                    $lookup: {
                        "from": "productimages",
                        "localField": "productId",
                        "foreignField": "productId",
                        "as": "pimgs"
                    }
                }
            ])
            .then((products) => {
                res(products);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.getfrProductsByCats = (fId, cId) => {
    return new Promise((res, rej) => {
        //franchiseproductModel.find(where)
        franchiseproductModel.aggregate([{
                    $match: { franchiseId: fId, catId: cId, is_active:"1" }
                },
                {
                    $lookup: {
                        "from": "products",
                        "localField": "productId",
                        "foreignField": "_id",
                        "as": "product"
                    }
                },
                {
                    $unwind: {
                        "path": "$product"
                    }
                },
                {
                    $lookup: {
                        "from": "productimages",
                        "localField": "productId",
                        "foreignField": "productId",
                        "as": "pimgs"
                    }
                },
                {
                    $lookup: {
                        from: "frproductvariants",
                        as: "productvariants",
                        localField: "_id",
                        foreignField: "frproductId"
                    }
                },
            ])
            .then((products) => {
                res(products);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.save = async(param) => {
    return new Promise((res, rej) => {
        franchiseproductModel.find({ "franchiseId": param.franchiseId, "productId": param.productId }, { "_id": 1 })
            .then((product) => {
                if (!product.length) {
                    var varient = param.varient;
                    delete param.varient;
                    franchiseproductModel.create(param)
                        .then((products) => {
                            res({ "success": 1, "msg": "Product saved successfully.", "data": products });
                        })
                        .catch((error) => {
                            rej(error);
                        });
                } else {
                    franchiseproductModel.findOneAndUpdate({ "_id": product[0]._id }, { $currentDate: { "modified": true }, $set: { is_active: param.is_active } }, { new: true })
                        .then((result) => {
                            res({ "success": 2, "msg": "Product status updated.", "data": result });
                        })
                        .catch((err) => {
                            rej(err);
                        });
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.makefeaturedproduct = async(param) => {
    return new Promise((res, rej) => {
        franchiseproductModel.find({ "franchiseId": param.franchiseId, "productId": param.productId }, { "_id": 1 })
            .then((product) => {
                if (!product.length) {
                    res({ "success": 0, "msg": "Product not saved.", "data": "" });
                } else {
                    franchiseproductModel.updateOne({ "_id": product[0]._id }, { $currentDate: { "modified": true }, $set: param })
                        .then((result) => {
                            res({ "success": 1, "msg": "", "data": result });
                        })
                        .catch((err) => {
                            rej(err);
                        });
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.saveVarient = async(varient) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.insertMany(varient)
            .then((varient) => {
                res(varient);
            })
            .catch((error) => {
                console.log(error);
                rej(error);
            });
    });
};

exports.updateOldVarient = async(varient) => {
    return new Promise((res, rej) => {
        varient.forEach((ele) => {
            frproductvariantsModel.updateOne({ _id: ele._id }, { $currentDate: { "modified": true }, $set: ele })
                .then((varient) => {
                    res(varient);
                })
                .catch((error) => {
                    console.log(error);
                    rej(error);
                });
        });

    });
};

exports.updateFranchiseProductPriority = async(id, priority) => {
    return new Promise((res, rej) => {
        franchiseproductModel.updateOne({ "_id": id }, { $currentDate: { "modified": true }, $set: { priority: priority } })
            .then((result) => {
                if (result.ok == 1) {
                    res(true);
                } else {
                    res(false);
                }
            })
            .catch((err) => {
                rej(err);
            });
    });
}

// exports.updateVarient = async (varient) => {
//   return new Promise((res, rej) => {
//     frproductvariantsModel.insertMany(varient)
//           .then((varient)=>{
//             res(varient);
//           })
//           .catch((error)=>{
//             console.log(error);
//             rej(error);
//           });
//   });
// };

exports.getproductvarient = async(pId) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.aggregate([{
                    $match: { frproductId: pId }
                },
                {
                    $lookup: {
                        from: 'franchiseproducts',
                        as: 'frproduct',
                        localField: 'frproductId',
                        foreignField: '_id'
                    }
                },
                {
                    $unwind: {
                        path: '$frproduct',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
            .then((varient) => {
                res(varient);
            })
            .catch((error) => {
                console.log(error);
                rej(error);
            });
    });
};

exports.getproductvarientbyId = async(pId) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.aggregate([{
                    $match: { _id: pId }
                },
                {
                    $lookup: {
                        from: 'franchiseproducts',
                        as: 'frproduct',
                        localField: 'frproductId',
                        foreignField: '_id'
                    }
                },
                {
                    $unwind: {
                        path: '$frproduct',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        as: 'product',
                        localField: 'productId',
                        foreignField: '_id'
                    }
                },
                {
                    $unwind: {
                        path: '$product',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'productimages',
                        as: 'productimg',
                        localField: 'product._id',
                        foreignField: 'productId'
                    }
                }, 
                {
                    $project:{ 
                        _id:1,
                        mrp: 1,
                        productId:1,
                        franchiseId:1,
                        frproductId:1,
                        frproductvarId:1,
                        price:1,
                        wholesale:1,
                        qty:1,
                        measurment:1, 
                        unit:1,
                        max_order:1,
                        disc_price:1,
                        procode:1,
                        is_active:1,
                        producttitle: "$product.title",
                        productid: "$product._id",
                        productimg:"$productimg.title"
                    }
                }
            ])
            .then((varient) => {
                res(varient);
            })
            .catch((error) => {
                console.log(error);
                rej(error);
            });
    });
};

exports.getfranchiseProductsAndVariants = (franchiseId) => {
    return new Promise((res, rej) => {
        franchiseproductModel.aggregate([{
                $match: { franchiseId: franchiseId }
            }, {
                $lookup: {
                    from: "frproductvariants",
                    as: "variants",
                    localField: "_id",
                    foreignField: "frproductId",
                }
            }])
            .then((products) => {
                res(products);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.edit = (frproductId) => {
    return new Promise((resolve, reject) => {
        franchiseproductModel.find({ "_id": frproductId })
            .then((frproduct) => {
                const resp = { "success": 0, "msg": "Record(s) not found.", "data": "" };
                if (frproduct.length > 0) {
                    resp.success = 1;
                    resp.msg = "One Record found...";
                    resp.data = frproduct[0];
                }
                resolve(resp);
            }).catch((error) => {
                reject(error);
            });
    });
};

exports.updateFrProductByCondition = (where, body) => { //update on diff cond and body
    console.log(body);
    return new Promise((resolve, reject) => {
        franchiseproductModel.updateOne(where, { $currentDate: { "modified": true }, $set: body })
            .then((frproduct) => {
                const resp = { "success": 0, "msg": "Record(s) not found.", "data": "" };
                if (frproduct.ok == 1) {
                    resp.success = 1;
                    resp.msg = "Product updated successfully.";
                }
                resolve(resp);
            }).catch((error) => {
                reject(error);
            });
    });
};

exports.update = (body) => {
    return new Promise((resolve, reject) => {
        franchiseproductModel.find({
                $and: [
                    { "_id": { $ne: body._id } },
                    { "franchiseId": body.franchiseId },
                    { "productId": body.productId },
                    { "catId": body.catId }
                ]
            })
            .then((frproduct) => { 
                const resp = { "success": 0, "msg": "Product already exist.", "data": body };
                if (frproduct.length > 0) {
                    resp.success = 2;
                    resolve(resp);
                } else { 
                    var frproductId = body._id; 
                    
                    delete body._id;
                    franchiseproductModel.updateOne({ "_id": frproductId }, { $currentDate: { "modified": true }, $set: body })
                        .then((frproduct) => {
                            if (frproduct.ok == 1) {
                                resp.success = 1;
                                resp.msg = "Product updated successfully.";
                            }
                            resolve(resp);
                        }).catch((error) => {
                            reject(error);
                        });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.status = (frpId, status) => {
    return new Promise((res, rej) => {
        franchiseproductModel.updateOne({ "_id": frpId }, { $currentDate: { "modified": true }, $set: { is_active: status } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (frpId, status) => {
    return new Promise((res, rej) => {
        franchiseproductModel.updateMany({ "_id": { $in: frpId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (frproductId) => {
    return new Promise((res, rej) => {
        franchiseproductModel.findByIdAndDelete(frproductId)
            .then((product) => {
                if (!product) {
                    res(false);
                } else {
                    res(true);
                }
            }).catch((err) => {
                rej(err);
            });
    });
};

//----franchise Producsts on basis of condition 
exports.getAllfrProductsOnCondition = (where) => {
    return new Promise((res, rej) => {
        franchiseproductModel.find(where)
            .then((frp) => {
                res(frp);
            })
            .catch((error) => {
                throw error;
            });
    });
}

//---------frenchise Products Varient
exports.getAllfrProductvarient = (where) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.find(where)
            .then((frp_varient) => {
                res(frp_varient);
            })
            .catch((error) => {
                throw error;
            });
    });
}

exports.frProductvarientsave = (param) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.create(param)
            .then((products) => {
                res({ "success": 1, "msg": "Product saved successfully.", "data": products });
            })
            .catch((error) => {
                rej(error);
            });
    });
}

exports.varientstatus = (frenchiseProductVarientIds, status) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.updateMany({ "_id": { $in: frenchiseProductVarientIds } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getFranchiseProductByVarId = async(id) => {
    return new Promise((res, rej) => {
        frproductvariantsModel.aggregate([{
                    $match: { _id: id }
                },
                {
                    $lookup: {
                        from: 'franchiseproducts',
                        as: 'frproduct',
                        localField: 'frproductId',
                        foreignField: '_id'
                    }
                }
            ])
            .then((varient) => {
                res(varient);
            })
            .catch((error) => {
                console.log(error);
                rej(error);
            });
    });
};

exports.findbyField = async(where) => {
    return new Promise((res, rej) => {
        franchiseproductModel.find(where).then((doc) => {
            res(doc);
        }).catch((err) => {
            rej(err);
        });
    });
};