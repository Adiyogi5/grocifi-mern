const luckydrawofferModel = require("../modules/LuckyDrawOffer");
const luckydrawproductsModel = require("../modules/LuckyDrawProducts");
const luckydrawusersModel = require("../modules/LuckyDrawUsers");
const franchiseProductsModel = require("../modules/FrProducts");
const productsModel = require("../modules/Products");

exports.offersproducts = async(pcids) => { 
    return new Promise((res, rej) => {
        productsModel.aggregate([{
                    $lookup: {
                        from: "franchiseproducts",
                        as: "frproduct",
                        localField: "_id",
                        foreignField: "productId"
                    }
                },
                {
                    $lookup: {
                        from: "productimages",
                        as: "pimg",
                        localField: "productId",
                        foreignField: "productId"
                    }
                },
                {
                    $lookup: {
                        from: "frproductvariants",
                        as: "productvar",
                        localField: "_id",
                        foreignField: "frproductId"
                    }
                },
                {
                    $match: { _id: { $in: pcids } }
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

exports.gettotalluckydraw = async(where) => {
    return new Promise((res, rej) => { 
        if(where){      
            luckydrawofferModel.aggregate([ 
             {
                $lookup: {
                    from: "franchises",
                    localField: "franchise_id",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
             {
                "$unwind": {
                    "path": "$franchise",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    title: 1, 
                    franchiseName: {$concat: ['$franchise.firmname']},
                }
            },
            { $match: where }
            ]).then((offer) => {
                res(offer.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{            
            luckydrawofferModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });  
        }          
    });
};

exports.getAllluckydraws = async(where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){    
            luckydrawofferModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        }else{
            luckydrawofferModel.aggregate([ 
                {
                    $lookup: {
                        from: "franchises",
                        localField: "franchise_id",
                        foreignField: "_id",
                        as: "franchise",
                    },
                },
                 {
                    "$unwind": {
                        "path": "$franchise",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: { 
                        _id:1,
                        title: 1,
                        is_active:1,
                        is_lock:1,
                        is_generate:1,
                        offer_winner:1,
                        franchise_id:1,
                        created:1, 
                        start_date:1,
                        expiry_date:1, 
                        offer_order:1,
                        offer_img:1,
                        franchiseName: {$concat: ['$franchise.firmname']},
                    }
                },
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
            ])
            .then((areas) => {
                res(areas);
            })
            .catch((error) => {
                rej(error);
            });
        }    
    });
};

exports.gettodayLuckyDraw = async(where) => {
    var result = [];
    return new Promise((res, rej) => { 
        luckydrawofferModel.aggregate([ 
                {
                    $lookup: {
                        from: "lucky_draw_products",
                        localField: "_id",
                        foreignField: "luckydraw_id",
                        as: "luckydrawproducts",
                    },
                },
                 {
                    "$unwind": {
                        "path": "$luckydrawproducts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: { 
                        _id:1,
                        title: 1,
                        is_active:1,
                        is_lock:1,
                        offer_winner:1,
                        franchise_id:1, 
                        start_date:1,
                        expiry_date:1, 
                        product_id: '$luckydrawproducts.product_id',
                    }
                },
                { $match: where } 
            ])
            .then((areas) => {
                res(areas);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.addLuckyDrawUser = async(param) => {
    return new Promise((res, rej) => {
        luckydrawusersModel
            .create(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getluckydrawlists = async(where) => {
    var result = [];
    return new Promise((res, rej) => { 
        luckydrawofferModel.find(where)
        .then((doc) => {
            if (!doc) {
                doc = result;
            }
            res(doc);
        })
        .catch((err) => {
            rej(err);
        });
         
    });
};

exports.getluckydraws = async(franchise_id, is_active) => {
    var result = [];
    return new Promise((res, rej) => {
        if (!franchise_id && !is_active) {
            luckydrawofferModel.find({ franchise_id: null, is_active: 1 })
                .then((doc) => {
                    if (!doc) {
                        doc = result;
                    }
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                });
        } else {
            luckydrawofferModel.find({ franchise_id, is_active })
                .then((doc) => {
                    if (!doc) {
                        doc = result;
                    }
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                });
        }
    });
};

exports.getOfferById = async(id) => {
    return new Promise((res, rej) => {
        luckydrawofferModel.findOne({ _id: id })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
}

exports.getOfferDetailById = async(id) => {
    return new Promise((res, rej) => {
        luckydrawofferModel.aggregate([ 
        {
            $lookup: {
                from: "franchises",
                localField: "franchise_id",
                foreignField: "_id",
                as: "franchise",
            },
        },
         {
            "$unwind": {
                "path": "$franchise",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $project: { 
                _id:1,
                title: 1,
                is_active:1,
                franchise_id:1,
                created:1, 
                start_date:1,
                expiry_date:1,
                is_lock:1,
                is_generate:1,
                offer_winner:1,
                offer_order:1,
                offer_img:1,
                franchise_id:1,
                description:1,
                franchiseName: {$concat: ['$franchise.firmname']},
            }
        },
        { $match: { _id: id } },   
        ])
        .then((areas) => {
            res(areas);
        })
        .catch((error) => {
            rej(error);
        });
    });
};

exports.getOfferPriority = async(fId, offerId) => {
    return new Promise((res, rej) => {  
        luckydrawofferModel.findOne({ franchise_id: fId }, { offer_order: 1 }).sort({ _id: -1 })
            .then((doc) => {
                if (doc && doc != null) {
                    res(doc.offer_order);
                } else {
                    res(0);
                }
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.saveOffer = async(param) => {
    return new Promise((res, rej) => {
        luckydrawofferModel
            .create(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.edit = async(id, body) => {
    return new Promise((res, rej) => {
        luckydrawofferModel
            .findOneAndUpdate({ _id: id }, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.status = (offerId, is_active) => {
    return new Promise((res, rej) => {
        luckydrawofferModel.updateOne({ "_id": offerId }, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.editOnBasisArray = async(idArr, body) => {
    return new Promise((res, rej) => {
        luckydrawofferModel
            .updateMany({ _id: { $in: idArr } }, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.saveOfferChild = async(param) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel
            .create(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.editOfferChild = async(id, body) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel
            .findOneAndUpdate({ _id: id }, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.offerChildRemove = async(param) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel.remove 

        luckydrawproductsModel.findOneAndRemove(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.generateOfferwinner = async(id, userIdsArr) => {
    return new Promise((res, rej) => {
        var ubody = {"is_winner":1}
        luckydrawusersModel.updateMany({ _id: { $in: userIdsArr } }, { $currentDate: { modified: true }, $set: ubody })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        //// update lucky draw offer
       var obody = {"is_generate":1}
        luckydrawofferModel
            .findOneAndUpdate({ _id: id }, { $currentDate: { modified: true }, $set: obody })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.removeOfferProduct = async(luckydraw_id, product_id) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel.remove({ luckydraw_id: luckydraw_id, product_id: product_id })
            .then((doc) => {
                console.log(doc);
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.hardDeleteOfferChild = async(id) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel
            .findOneAndRemove(id)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.editOnBasisArrayOfferChild = async(idArr, body) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel
            .updateMany({ _id: { $in: idArr } }, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.MultipleHardDelete_offerChild = async(idArrs) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel
            .remove({ _id: idArrs })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getParticateUsers = async(cond = {}) => {
    return new Promise((res, rej) => { 
        luckydrawusersModel
            .aggregate([
                [{ $match: cond },
                {
                        $lookup: {
                            from: "products",
                            localField: "product_id",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $unwind: {
                            path: "$product",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "users",
                        },
                    }, 
                    {
                        $unwind: {
                            path: "$users",
                        },
                    },
                    {
                        $lookup: {
                            from: "orders",
                            localField: "order_id",
                            foreignField: "_id",
                            as: "orders",
                        },
                    }, 
                    {
                        $unwind: {
                            path: "$orders",
                        },
                    },
                    {
                        $project: {
                            "_id":1,
                            "user_id": 1,
                            "is_winner":1,
                            "product_name": "$product.title",
                            "user_name": {$concat: ['$users.fname',' ','$users.lname']},
                            "user_img": "$users.img",
                            "order_id":"$orders.orderUserId",
                            "coupon": 1
                        }
                    } 
                ],
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });    
    });
};

exports.getAllOffersChild = async(cond = {}) => {
    return new Promise((res, rej) => {
        luckydrawproductsModel.find(cond)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getAPPAllOffers = async(where) => {
 return new Promise((res, rej) => {
    luckydrawofferModel
        .find(where)
        .then((doc) => {
            res(doc);
        })
        .catch((err) => {
            rej(err);
        });
    });
};

exports.getproductDetails = async(id, prod_id) => {
    return new Promise((res, rej) => {
        franchiseProductsModel
            .aggregate([
                [{
                        $match: {
                            franchiseId: id,
                            productId: prod_id
                        },
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "productId",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $unwind: {
                            path: "$product",
                        },
                    },
                    {
                        $lookup: {
                            from: "productimages",
                            localField: "productId",
                            foreignField: "productId",
                            as: "productImg",
                        },
                    },
                    {
                        $lookup: {
                            from: "frproductvariants",
                            localField: "_id",
                            foreignField: "frproductId",
                            as: "productvar",
                        },
                    },
                    {
                        $project: {
                            "product": 1,
                            "productImg": 1,
                            "productvar": 1,
                            "isPacket": 1
                        }
                    }

                ],
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};