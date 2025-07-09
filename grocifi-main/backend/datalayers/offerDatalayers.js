const offerModel = require("../modules/Offers.Js");
const offerChildModel = require("../modules/OfferChild");
const franchiseProductsModel = require("../modules/FrProducts");
const productsModel = require("../modules/Products");

exports.offersproducts = async(pcids) => { //pcids = ids of products and categories
    //productsModel

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

exports.gettotaloffer = async(where) => {
    return new Promise((res, rej) => { 
        if(where){      
            offerModel.aggregate([ 
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
            { $match: where },
            {
                $project: {
                    _id:1,
                    title: 1, 
                    franchiseName: {$concat: ['$franchise.firmname']},
                }
            }
            ]).then((offer) => {
                res(offer.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{            
            offerModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });  
        }          
    });
};

exports.getAPPAllOffers = async(where) => {
 return new Promise((res, rej) => {
    offerModel
        .find(where)
        .then((doc) => {
            res(doc);
        })
        .catch((err) => {
            rej(err);
        });
    });
};

exports.getAllOffers = async(where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){    
            offerModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        }else{
            offerModel.aggregate([ 
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
                        is_expiry:1,
                        offer_type:1,
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

exports.getOffers = async(franchise_id, is_active) => {
    var result = [];
    return new Promise((res, rej) => {
        if (!franchise_id && !is_active) {
            offerModel.find({ franchise_id: null, is_active: 1 })
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
            offerModel.find({ franchise_id, is_active })
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
        offerModel.findOne({ _id: id })
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
        offerModel.aggregate([ 
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
                is_expiry:1,
                offer_type:1,
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
        offerModel.findOne({ franchise_id: fId }, { offer_order: 1 }).sort({ _id: -1 })
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
        offerModel
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
        offerModel
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
        offerModel.updateOne({ "_id": offerId }, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.editOnBasisArray = async(idArr, body) => {
    return new Promise((res, rej) => {
        offerModel
            .updateMany({ _id: { $in: idArr } }, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.hardDelete = async(id) => {
    return new Promise((res, rej) => {
        offerModel
            .findOneAndRemove(id)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.MultipleHardDelete = async(idArrs) => {
    return new Promise((res, rej) => {
        offerModel
            .remove({ _id: idArrs })
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
        offerChildModel
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
        offerChildModel
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
        offerChildModel.remove



        offerChildModel.findOneAndRemove(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.removeOfferProduct = async(offer_id, product_id) => {
    return new Promise((res, rej) => {
        offerChildModel.remove({ offer_id: offer_id, product_id: product_id })
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
        offerChildModel
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
        offerChildModel
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
        offerChildModel
            .remove({ _id: idArrs })
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
        offerChildModel.find(cond)
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