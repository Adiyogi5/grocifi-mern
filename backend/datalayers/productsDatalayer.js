var fs = require("fs");
const franchiseModel = require("../modules/Franchise");
const frproductsModel = require("../modules/FrProducts");
const franchisecategoryModel = require("../modules/FranchiseCategory");
const productsModel = require("../modules/Products");
const productsimgModel = require("../modules/ProductImage");
const productwishModel = require("../modules/ProductWishlist");
const productsvariantModel = require("../modules/FrProductVariants");
const offerChildModel = require("../modules/OfferChild");
const cartModel = require("../modules/Cart");


exports.gettotalProduct = async(where) => {
    return new Promise((res, rej) => { 
        if(where){
            productsModel.aggregate([
                {
                    $lookup: {
                        as: "catagory",
                        localField: "catId",
                        foreignField: "_id",
                        from: "catagory_subcatagories"
                    }
                }, 
                 {
                    "$unwind": {
                        "path": "$catagory",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: {  
                        title: 1, 
                        catName: '$catagory.title',
                    }
                }, 
                { $match: where }, 
            ])
            .then((products) => { 
                res(products.length);
            })
            .catch((error) => {
                rej(error);
            }); 
        }else{
            productsModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};


exports.getAllProducts = (where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){
            productsModel.aggregate([{
                    $match: where
                },
                {
                    $lookup: {
                        as: "catagory",
                        localField: "catId",
                        foreignField: "_id",
                        from: "catagory_subcatagories"
                    }
                },
                {
                    $sort: { title: 1 }
                },
                {
                    $project: {
                        __v: 0,
                        "catagory.__v": 0,
                    }
                },
                {
                    $unwind: { path: "$catagory", preserveNullAndEmptyArrays: true },
                }
            ])
            .then((products) => {
                res(products);
            })
            .catch((error) => {
                rej(error);
            });
        }else{
           productsModel.aggregate([
                {
                    $lookup: {
                        as: "catagory",
                        localField: "catId",
                        foreignField: "_id",
                        from: "catagory_subcatagories"
                    }
                }, 
                 {
                    "$unwind": {
                        "path": "$catagory",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: { 
                        _id:1,
                        title: 1,
                        is_active:1,
                        is_global:1,
                        catId:1,
                        created:1, 
                        description:1, 
                        catName: '$catagory.title',
                    }
                }, 
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
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


exports.getProductsByCats = (cId, isglobal=null) => {
    return new Promise((res, rej) => { 
        if(isglobal==true || isglobal==false ){
            var where = {catId: cId, is_global:isglobal};
        }else{
            var where = {catId: cId};
        }
        productsModel.aggregate([{
                    $match: where
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

exports.save = async(param, files) => {
    return new Promise((res, rej) => {
        delete param.imgs;
        delete param._imgs;
        productsModel.create(param)
            .then((products) => {
                if (products != null && products._id) {
                    var data = [];
                    var isMain = true;
                    if (files != "") {
                        files = files.split(",");
                        files.forEach((ele) => {
                            data.push({
                                title: ele,
                                productId: products._id,
                                isMain: isMain,
                            });
                            isMain = false;
                        });

                        productsimgModel.create(data)
                            .then((imgdata) => {
                                //console.log("Image saved");
                            })
                            .catch((error) => {
                                throw error;
                            });
                    }
                }
                res(products);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.edit = (productId) => {
    return new Promise((res, rej) => {
        productsModel.aggregate([{
                    $match: { _id: productId },
                },
                {
                    $lookup: {
                        from: "productimages",
                        localField: "_id",
                        foreignField: "productId",
                        as: "prodImg",
                    },
                },
                {
                    $project: { __v: 0, "prodImg.__v": 0 },
                },
                /*{
                    $unwind: { path: "$prodImg", preserveNullAndEmptyArrays: true },
                },*/
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body, files) => {
    return new Promise((res, rej) => {
        if (body._imgs != undefined) {
            delete body.imgs;
            delete body._imgs;
            productsModel.findOneAndUpdate({ _id: body._id }, { $currentDate: { modified: true }, $set: body })
                .then((products) => {
                    if (products != null && products._id && files != "") {
                        var data = [];
                        var isMain = true;
                        files = files.split(",");
                        files.forEach((ele) => {
                            data.push({
                                title: ele,
                                productId: products._id,
                                isMain: isMain
                            });
                            isMain = false;
                        });
                        productsimgModel
                            .create(data)
                            .then((imgdata) => {
                                //----------------
                            })
                            .catch((error) => {
                                throw error;
                            });
                    }
                    res(products);
                })
                .catch((err) => {
                    rej(err);
                });
        } else {
            var productId = body._id;
            delete body._id;
            productsModel.findOneAndUpdate({ _id: productId }, { $currentDate: { modified: true }, $set: body })
                .then((products) => {
                    if (products != null && products._id && files.length > 0) {
                        var data = [];
                        files.forEach((element) => {
                            data.push({ title: element.filename, productId: productId });
                        });
                        productsimgModel
                            .create(data)
                            .then((imgdata) => {
                                imgdata.forEach((ele) => {
                                    var srcPath =
                                        __dirname + "/../public/uploads/temp/" + ele.title;
                                    var destPath =
                                        __dirname + "/../public/uploads/product_img/" + ele.title;
                                    fs.copyFileSync(srcPath, destPath);
                                });

                                imgdata.forEach((ele) => {
                                    fs.unlinkSync(
                                        __dirname + "/../public/uploads/temp/" + ele.title
                                    );
                                });
                            })
                            .catch((error) => {
                                throw error;
                            });
                    }
                    res(products);
                })
                .catch((err) => {
                    rej(err);
                });
        }
    });
};

exports.status = (_id, status) => {
    return new Promise((res, rej) => {
        productsModel.updateOne({ _id: _id }, { $currentDate: { modified: true }, $set: { is_active: status } })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        productsModel
            .updateMany({ _id: { $in: pId } }, { $currentDate: { modified: true }, $set: status })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (productId) => {
    return new Promise((res, rej) => {
        productsModel
            .findByIdAndDelete(productId)
            .then((product) => {
                if (!product) {
                    res(false);
                } else {
                    res(true);
                }
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.franchiseProductsIds = async(areaFrIds, catsubcatidArr) => {
    return new Promise((res, rej) => {
        frproductsModel
            .aggregate([{
                    $match: {
                        franchiseId: { $in: areaFrIds },
                        catId: { $in: catsubcatidArr },
                        is_active: "1",
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
                    $unwind: { path: "$product" },
                },
                {
                    $project: { __v: 0, "product.__v": 0 },
                },
                {
                    /*$sort: { priority: 1 }*/
                    $sort: { "product.title": 1 }
                }
            ])
            .then((data) => {
                if (data.length > 0) {
                    res(data);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.NewfranchisetotalProducts = async(where) => {
    return new Promise((res, rej) => {         
            frproductsModel
                .aggregate([
                    {
                        $lookup: {
                            from: "products",
                            localField: "productId",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $unwind: { path: "$product" },
                    },
                    {
                        $project: { 
                            franchiseId: 1, 
                            catId: 1, 
                            is_active:1, 
                            "product.title":1 },
                    },
                    {
                        $match: where
                    },  
                ])
                .then((data) => {  
                    res(data.length );                     
                })
                .catch((error) => {
                    rej(error);
                }); 

    });
};

exports.NewfranchiseProductsIds = async(where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){ 
            frproductsModel
                .aggregate([{
                        $match: where,
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
                        $unwind: { path: "$product" },
                    },
                    {
                        $project: { __v: 0, "product.__v": 0 },
                    },
                    { 
                        $sort: { "product.title": 1 }
                    }
                ])
                .then((data) => {
                    if (data.length > 0) {
                        res(data);
                    } else {
                        res(null);
                    }
                })
                .catch((error) => {
                    rej(error);
                });
        }else{
            frproductsModel
                .aggregate([
                    {
                        $lookup: {
                            from: "products",
                            localField: "productId",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $unwind: { path: "$product" },
                    },
                    {
                        $project: { __v: 0, "product.__v": 0 },
                    },
                    {
                        $match: where,
                    }, 
                    { $sort: { "product.title": 1 } },
                    { $skip : params.skip },
                    { $limit : params.limit  }
                ])
                .then((data) => {
                    if (data.length > 0) {
                        res(data);
                    } else {
                        res(null);
                    }
                })
                .catch((error) => {
                    rej(error);
                });
        }

    });
};

exports.getFranchiseProductIncart = async(id) => {
    return new Promise((res, rej) => {
        frproductsModel
            .aggregate([{
                    $match: {
                        _id: id,
                        "is_active":"1"
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
                    $unwind: { path: "$product" },
                },
                {
                    $project: { __v: 0, "product.__v": 0 },
                },
            ])
            .then((data) => {
                if (data.length > 0) {
                    res(data);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};


exports.getFranchiseProductById = async(id) => {
    return new Promise((res, rej) => {
        frproductsModel
            .aggregate([{
                    $match: {
                        _id: id,
                        is_active: "1",
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
                    $unwind: { path: "$product" },
                },
                {
                    $project: { __v: 0, "product.__v": 0 },
                },
            ])
            .then((data) => {
                if (data.length > 0) {
                    res(data);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.findbyField = async(where) => {
    return new Promise((res, rej) => {
        productsModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getProductwishlist = (productIds, userId) => {
    return new Promise((res, rej) => {
        productwishModel.find({ "product_id": { $in: productIds }, "user_id": userId}, { _id: 0, user_id: 1, product_id: 1 })
            .then((wishs) => {
                if (wishs.length > 0) {
                    res(wishs);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.getAllProductsImages = (productIds) => {
    return new Promise((res, rej) => {
        productsimgModel.find({ "productId": { $in: productIds } }, { _id: 0, title: 1, productId: 1, isMain: 1 })
            .then((imgs) => {
                if (imgs.length > 0) {
                    res(imgs);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.updateDefaultImage = (_id, pid) => {
    return new Promise((res, rej) => {

        productsimgModel.updateMany({ productId: pid }, { $currentDate: { modified: true }, $set: { isMain: false } })
            .then((doc) => {
                productsimgModel.findOneAndUpdate({ _id: _id }, { $currentDate: { modified: true }, $set: { isMain: true } })
                    .then(result => {
                        res(result);
                    })
                    .catch(err => {
                        rej(err)
                    });
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.deleteImage = (_id, pid) => {
    return new Promise((res, rej) => {
        productsimgModel.findOneAndDelete({ _id: _id })
            .then(result => {
                res(result);
            })
            .catch(err => {
                rej(err)
            });
    });
};

exports.getAllProductsVarient = (productIds, nameSort= null, dateSort = null, priceSort = null, areaFrIds = null) => {
    var sortcondn = sortingProductVarient(nameSort, dateSort, priceSort)
     
    return new Promise((res, rej) => {
        productsvariantModel.find({ "productId": { $in: productIds },  "franchiseId": { $in: areaFrIds } }).sort(sortcondn)
            .then((varient) => {
                if (varient.length > 0) {
                    res(varient);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};


exports.getCartDetailsByVarientId = (where) => {
    return new Promise((res, rej) => {
        cartModel.aggregate([{
                    $match: where,
                },
                {
                    $lookup: {
                        from: "frproductvariants",
                        let: { frproductvarId: "$frproductvarId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$frproductvarId"] },
                                },
                            },  
                            {
                                $project: { 
                                    "description":1,
                                    "is_active":1,
                                    "catId":1,
                                    "measurment":1,
                                    "unit":1,
                                    "price":1,
                                    "disc_price":1,
                                    "qty":1,
                                    "mrp":1,
                                    "wholesale":1,
                                    "is_ws_active":1,
                                    "franchiseId":1,
                                    "frproductId":1 
                                }
                            },
                            {
                                $lookup: {
                                    from: "franchiseproducts",
                                    let: { frproductId: "$frproductId" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ["$_id", "$$frproductId"] },
                                            },
                                        },  
                                        {
                                            $project: { 
                                                "isPacket":1,
                                                "is_active":1,
                                                "franchiseId":1,
                                                "priority":1,
                                                "product_max_order":1,
                                                "product_unit":1,
                                                "product_quality":1,
                                                "isShown":1,
                                                "productId":1
                                            }
                                        },   
                                        {
                                            $lookup: {
                                                from: "products",
                                                let: { productId: "$productId" },
                                                pipeline: [
                                                    {
                                                        $match: {
                                                            $expr: { $eq: ["$_id", "$$productId"] },
                                                        },
                                                    }, 
                                                    {
                                                        $project: { 
                                                            "title":1,
                                                            "description":1,
                                                            "is_active":1
                                                        }
                                                    },
                                                    {
                                                        $lookup: {
                                                            from: "productimages",
                                                            let: { productId: "$_id" },
                                                            pipeline: [
                                                                {
                                                                    $match: {
                                                                        $expr: { $eq: ["$productId", "$$productId"] },
                                                                    },
                                                                },
                                                                {
                                                                    $project: { 
                                                                        "title":1,
                                                                        "productId":1,
                                                                        "isMain":1,
                                                                        "is_active":1
                                                                    }
                                                                },                                                                 
                                                            ],
                                                            as: "productimage",
                                                        }, 
                                                    },
                                                ],
                                                as: "products",
                                            }, 
                                        },
                                    ],
                                    as: "frProducts",
                                }, 
                            },
                        ],
                        as: "productvar",
                    }, 
                },
                {
                    $project: { 
                        "_id":1,
                        "frproductId":1,
                        "frproductvarId":1,
                        "unit":1,
                        "qty":1,
                        "session_id":1,
                        "productvar" : "$productvar", 
                    }
                }, 
               
            ])
            .then((cart) => {
                res(cart);
            })
            .catch((error) => {
                rej(error);
            });
    });
}


exports.getProductDetailsByVarientId = (idsArr) => {
    return new Promise((res, rej) => {
        productsvariantModel.aggregate([{
                    $match: { _id: { $in: idsArr } }
                },
                {
                    $lookup: {
                        from: "franchiseproducts",
                        as: "frProducts",
                        localField: "frproductId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        as: "products",
                        localField: "frProducts.productId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "productimages",
                        as: "pImgs",
                        localField: "productId",
                        foreignField: "productId"
                    }
                }
            ])
            .then((varient) => {
                res(varient);
            })
            .catch((error) => {
                rej(error);
            });
    });
}

exports.getProductsVarientById = (id) => {
    return new Promise((res, rej) => {
        productsvariantModel.find({ _id: id }).sort({ "price": 1, "created": 1 })
            .then((varient) => {
                if (varient.length > 0) {
                    res(varient);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.productVarientFindByField = async(where) => {
    return new Promise((res, rej) => {
        productsvariantModel.find(where)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

//upadte qty on order palced, returned or cancelled
exports.updateQtyOnOrderPlaced = (productVarId, qty) => {
    //let qty = condition.qty;
    //console.log(productVarId);
    //console.log(qty);
    return new Promise((res, rej) => {
        productsvariantModel.updateOne({ "_id": productVarId }, { $currentDate: { "modified": true }, $set: { "qty": parseInt(qty) } })
            .then((ack) => {
                res(ack);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.ProductimageDetails = async(productId) => {
    return new Promise((res, rej) => { 
         productsimgModel.find({ "productId": productId })
            .then((imgs) => {
                if (imgs.length > 0) {
                    res(imgs);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                rej(error);
            });
    })
}; 

exports.completeProductDetails = async(producId) => {
    var data = await frproductsModel.find({ _id: producId });
    return new Promise((resolve, reject) => {
        if (data.length > 0) {
            frproductsModel
                .aggregate([
                    { $match: { _id: data[0]._id } },
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
                            preserveNullAndEmptyArrays: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "productimages",
                            localField: "productId",
                            foreignField: "productId",
                            as: "product_with_image",
                        },
                    },
                    {
                        $unwind: {
                            path: "$product_with_image",
                            preserveNullAndEmptyArrays: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "frproductvariants",
                            localField: "productId",
                            foreignField: "productId",
                            as: "product_variants",
                        },
                    },
                    {
                        $unwind: {
                            path: "$product_variants",
                            preserveNullAndEmptyArrays: false,
                        },
                    },
                    {
                        $project: {
                            isPacket: 1,
                            "product.title": 1,
                            "product.description": 1,
                            "product_with_image.title": 1,
                            product_variants: 1,
                        },
                    },
                ])
                .then((productInfo) => {
                    var productObject = {};
                    var productImage = [];
                    productObject.variants = {};
                    productObject.title = productInfo[0].product.title;
                    productObject.productDescriptiion =
                        productInfo[0].product.description;
                    productObject.variants.measurement =
                        productInfo[0].product_variants.measurment;
                    productObject.variants.unit = productInfo[0].product_variants.unit;
                    productObject.variants.price = productInfo[0].product_variants.price;
                    productObject.variants.disc_price =
                        productInfo[0].product_variants.disc_price;
                    productObject.variants.qty = productInfo[0].product_variants.qty;
                    productObject.variants.description =
                        productInfo[0].product_variants.description;
                    productInfo.forEach((elem) => {
                        productImage.push(elem.product_with_image.title);
                    });
                    productObject.image = productImage;
                    resolve(productObject);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject(false);
        }
    });
};

exports.productVarientFindByCondition = async(_ids) => {
    return new Promise((resolve, reject) => {
        productsvariantModel.aggregate([{
            $match: { "_id": { $in: _ids } },
        }, ]).then((data) => {
            if (data.length) {

                resolve(data);
            } else {
                resolve(false)
            }
        }).catch((err) => {
            reject(err);
        })
    })

}

exports.catAndSubCatDetails_OnBasisProductid = async(prodId) => {
    return new Promise((res, rej) => {
        productsModel.aggregate([{
            '$match': {
                '_id': prodId
            }
        }, {
            '$lookup': {
                'from': 'catagory_subcatagories',
                'localField': 'catId',
                'foreignField': '_id',
                'as': 'catagory'
            }
        }, {
            '$unwind': {
                'path': '$catagory'
            }
        }, {
            '$lookup': {
                'from': 'catagory_subcatagories',
                'localField': 'catagory._id',
                'foreignField': 'catagory_id',
                'as': 'subCatagory'
            }
        }, {
            '$unwind': {
                'path': '$subCatagory'
            }
        }]).then((data) => {
            res(data);
        }).catch((err) => {
            rej(err);
        })

    })

}


function sortingProductVarient(nameSort, dateSort, priceSort) {
    let result;
    if (dateSort) {
        result = { "created": dateSort };
        return result;
    } else if (priceSort) { 
        result = { "price": priceSort }
        return result;
    } else if (nameSort) {        
        result = { "title": nameSort }
        return result;
    } else {
        result = {};
        return result;
    }
}

exports.getProductDetailsByFrpId = (id) => {
    return new Promise((res, rej) => {
        frproductsModel.aggregate([{
                    $match: { _id: id }
                },
                {
                    $lookup: {
                        from: "frproductvariants",
                        as: "variants",
                        localField: "_id",
                        foreignField: "frproductId"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        as: "product",
                        localField: "productId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "productimages",
                        as: "pimg",
                        localField: "productId",
                        foreignField: "productId"
                    }
                }
            ])
            .then((result) => {
                res(result);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

/*exports.searchproductsandcats = async(str, areaId) => {
    str = new RegExp(str, 'i');
    var where = { $or: [{ "title": str }, { "category.title": str }] };
    console.log(where);
    return new Promise((res, rej) => {
        productsModel.aggregate([{
                    $lookup: {
                        from: "catagory_subcatagories",
                        as: "category",
                        localField: "catId",
                        foreignField: "_id"
                    }
                },
                {
                    $match: where
                },
                {
                    $project: { _id: 1, "category._id": 1 },
                }
            ])
            .then((products) => {
                res(products);
            })
            .catch((error) => {
                rej(error);
            });
    });
};*/

exports.searchproducts = async(franchiseId, pcids) => { //pcids = ids of products and categories
    var where = { $and: [{ franchiseId: franchiseId, is_active: "1" }, { $or: [{ "productId": { $in: pcids } }, { "catId": { $in: pcids } }] }] };

    return new Promise((res, rej) => {
        frproductsModel.aggregate([{
                    $lookup: {
                        from: "products",
                        as: "product",
                        localField: "productId",
                        foreignField: "_id"
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
                    $match: where
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

exports.searchproductsandcats = async(str, areaId) => {
    str = new RegExp(str, 'i');
    var where = { $or: [{ "title": str }, { "category.title": str }], "$and": [{
                is_active: "1" }] };
   // console.log(where);
    return new Promise((res, rej) => {
        productsModel.aggregate([{
                    $lookup: {
                        from: "catagory_subcatagories",
                        as: "category",
                        localField: "catId",
                        foreignField: "_id"
                    }
                },
                {
                    $match: where
                },
                {
                    $project: { _id: 1, "category._id": 1 },
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

exports.getfranchiseproducts = async(franchiseId, catIds, userType=0) => {
    var where = { franchiseId: franchiseId, is_active: "1", isShown: true, catId: { $in: catIds } };
    if(userType==0){
        var whereprovar  = { $expr: { $eq: ["$frproductId", "$$frproductId"] }, is_active:{$ne: "2"} };
    }else if(userType==1){
        var whereprovar  = { $expr: { $eq: ["$frproductId", "$$frproductId"] }, is_ws_active: {$ne: "2"} };
    }
    return new Promise((res, rej) => {
        frproductsModel.aggregate([{
                    $lookup: {
                        from: "products",
                        as: "product",
                        localField: "productId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "productimages",
                        as: "productImg",
                        localField: "productId",
                        foreignField: "productId"
                    }
                },
                {
                    $lookup: { 
                        from: "frproductvariants",
                        let: { "frproductId": "$_id" }, 
                        pipeline: [
                          {
                            $match: whereprovar,
                          },
                        ],
                        as: "productvar",
                    }
                },   
                {
                    $match: where
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


exports.allfranchiseproductvarient = async(where) => {
    return new Promise((res, rej) => {
        productsvariantModel.aggregate([ 
                {
                    $match: where
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

exports.getallfranchiseproducts = async(franchise_id) => {
    var where = { franchiseId: franchise_id }; 
    return new Promise((res, rej) => {
        frproductsModel.aggregate([ 
                {
                    $match: where
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


exports.allproductsoffranchise = async(franchise_id) => {
    var where = { franchiseId: franchise_id };

    return new Promise((res, rej) => {
        productsvariantModel.aggregate([{
                    $lookup: {
                        from: "franchiseproducts",
                        as: "frproduct",
                        localField: "frproductId",
                        foreignField: "_id"
                    }
                },
                {
                    $match: where
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


exports.allfranchiseproductsbyfrpid = async(frpId) => {
    var where = { _id: frpId };

    return new Promise((res, rej) => {
        productsvariantModel.aggregate([{
                    $lookup: {
                        from: "franchiseproducts",
                        as: "frproduct",
                        localField: "frproductId",
                        foreignField: "_id"
                    }
                },
                {
                    $match: where
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


exports.getProductsByProcode = async(where) => {
    return new Promise((res, rej) => { 
            productsModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            }); 
    });
};
 

exports.getProductvariantByProcode = async(where) => {
    return new Promise((res, rej) => { 
        productsvariantModel.aggregate([
                {
                    $match: where
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


exports.update_search = (id, body) => {
    return new Promise((res, rej) => {
        productsModel.updateOne({ _id: id }, { $currentDate: { modified: true }, $set: body })
            .then((products) => {
                res(products);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getFranchiseProductList = async(franchiseId, catIds) => {
    var where = { franchiseId: franchiseId, catId: { $in: catIds } };
    return new Promise((res, rej) => {
        frproductsModel.aggregate([{
                    $lookup: {
                        from: "products",
                        as: "product",
                        localField: "productId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "productimages",
                        as: "productImg",
                        localField: "productId",
                        foreignField: "productId"
                    }
                },
                {
                    $match: where
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

 
exports.NewfeatureProductsIds = async(where, params, franchiseId, userType, userId) => {
    if(userType==0){
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,                                                               
            is_active: {$ne:"2"}   
        } ;
    }else{
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,                                                               
            is_ws_active: {$ne:"2"}  
        } ;
    }
    return new Promise((res, rej) => {
        
            franchisecategoryModel
                .aggregate([ 
                    {
                        $match: where,
                    },
                    {
                        $lookup: {
                            from: "catagory_subcatagories",
                            let: { topic: "$catId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$_id", "$$topic"] }
                                    },
                                }, 
                                {
                                    $lookup: {
                                        from: "products",
                                        let: { catId: "$_id" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: { $eq: ["$catId", "$$catId"] }
                                                },
                                            },  
                                            { $sort: { "product.title": 1 } },
                                            { $skip : params.skip },
                                            { $limit : params.limit  },
                                            {
                                                $lookup: {
                                                    from: "franchiseproducts",
                                                    let: { productId: "$_id" },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: { $eq: ["$productId", "$$productId"] },
                                                                franchiseId: franchiseId,
                                                                is_active: "1"
                                                            },
                                                        },  
                                                        {
                                                            $project: { isPacket: 1, 
                                                                        franchiseId: 1, 
                                                                        productId: 1, 
                                                                        catId: 1, 
                                                                        priority: 1, 
                                                                        product_max_order:1,
                                                                        product_unit: 1,
                                                                        product_quality: 1, 
                                                                        isShown: 1,       
                                                                        is_active: 1,
                                                                        max_order: { $cond: { 
                                                                              if: { $eq: ["$product_unit", 1] },
                                                                              then: {$multiply: ["$product_max_order", 1000] },  
                                                                              else: {"$cond": {
                                                                                    "if": { "$eq": ["$product_unit",3]}, 
                                                                                    "then":  {$multiply: ["$product_max_order", 1000] }, 
                                                                                    "else": '$product_max_order'
                                                                                  }},
                                                                            },
                                                                          },  
                                                                    }
                                                        }
                                                    ],
                                                    as: "franchiseproducts",
                                                }, 
                                            },
                                            {
                                                $unwind: { path: "$franchiseproducts" },
                                            },
                                            {
                                                $lookup: {
                                                    from: "frproductvariants",
                                                    let: { productId: "$_id" },
                                                    pipeline: [
                                                        {
                                                            $match: wherepro,
                                                        },  
                                                        {
                                                            $project: {                                                                 
                                                                description: 1,
                                                                show_default: 1,                                                                
                                                                created: 1,
                                                                modified: 1,
                                                                catId: 1,
                                                                productId: 1,
                                                                frproductId: 1,
                                                                franchiseId: 1,
                                                                measurment: 1,
                                                                unit: 1,
                                                                price: 1,
                                                                disc_price: 1,
                                                                qty: 1,                                                                
                                                                mrp: 1,
                                                                wholesale: 1,
                                                                is_ws_active:1,
                                                                provar_max_order: "$franchiseproducts.product_max_order",
                                                                is_active: { 
                                                                    $cond: {
                                                                      if: { $eq: [userType, "1"] },
                                                                      then: '$is_ws_active',
                                                                      else: '$is_active'                                                                      
                                                                    },
                                                                },
                                                                its_unit: {$cond: { 
                                                                      if: { $eq: ["$unit", 1] },
                                                                      then: {$multiply: ["$measurment", 1000] },  
                                                                      else: {"$cond": {
                                                                            "if": { "$eq": ["$unit",3]}, 
                                                                            "then":  {$multiply: ["$measurment", 1000] }, 
                                                                            "else": "$measurment"
                                                                          }},
                                                                    },
                                                                }, 
                                                                /*its_max_order: { $cond: { 
                                                                          if: { $eq: ["$unit", 1] },
                                                                          then: {$multiply: ["$provar_max_order", 1000] },  
                                                                          else: {"$cond": {
                                                                                "if": { "$eq": ["$unit",3]}, 
                                                                                "then":  {$multiply: ["$provar_max_order", 1000] }, 
                                                                                "else": "$provar_max_order"
                                                                              }},
                                                                        },
                                                                      }, */ 
                                                            }
                                                        }
                                                    ],
                                                    as: "productvar",
                                                }, 
                                            },
                                            {
                                                $lookup: {
                                                    from: "productimages",
                                                    let: { productId: "$_id" },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: { $eq: ["$productId", "$$productId"] }
                                                            },
                                                        },  
                                                        {
                                                            $project: { title: 1, productId: 1, isMain: 1, is_active: 1 }
                                                        }
                                                    ],
                                                    as: "productimages",
                                                }, 
                                            },
                                            {
                                                $lookup: {
                                                    from: "product_wishlists",
                                                    let: { product_id: "$_id" },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: { $eq: ["$product_id", "$$product_id"] },
                                                                user_id: userId
                                                            },
                                                        },  
                                                        {
                                                            $project: { 
                                                                user_id:1,
                                                                status: { 
                                                                    $cond: {
                                                                      if: { $lt: ["$value", "1"] },
                                                                      then: 'true',
                                                                      else: 'false'                                                                      
                                                                    },
                                                                }, }
                                                        }
                                                    ],
                                                    as: "productwishlist",
                                                }, 
                                            }, 
                                            {
                                                $project: { 
                                                    title: 1, 
                                                    catId: 1, 
                                                    description: 1, 
                                                    is_active: 1, 
                                                    "isPacket": "$franchiseproducts.isPacket",
                                                    "frpro_is_active": "$franchiseproducts.frpro_is_active",
                                                    "franchiseId": "$franchiseproducts.franchiseId",
                                                    "productId": "$franchiseproducts.productId",
                                                    "catId": "$franchiseproducts.catId",
                                                    "priority": "$franchiseproducts.priority",
                                                    "product_unit": "$franchiseproducts.product_unit",
                                                    "product_quality": "$franchiseproducts.product_quality",
                                                    "isShown": "$franchiseproducts.isShown",
                                                    "product_max_order": "$franchiseproducts.product_max_order",
                                                    "max_order": "$franchiseproducts.max_order", 
                                                    "productwishlist": "$productwishlist",                                                     
                                                    "productimages": "$productimages",
                                                    "productvar": "$productvar",
                                                    "isproductvar": {$size:"$productvar"}
                                                }
                                            },
                                            {
                                                $match: {$expr:{$gt:["$isproductvar", 0]} },
                                            }, 
                                        ],
                                        as: "product",
                                    }, 
                                },
                               
                            ],
                            as: "category",
                        }, 
                    },
                  
                    {
                        $unwind: { path: "$category" },
                    },
                   
                    {
                        $project: { 
                            "category._id":1,
                            "category.title":1, 
                            "category.catagory_img":1,
                            "category.slug":1,
                            "category.catcode":1,   
                            "category.product":1,
                            ///"isproductvar": "$category.product.isproductvar"
                        },
                    }, 
                    
                ])
                .then((data) => {
                    if (data.length > 0) {
                        res(data);
                    } else {
                        res(null);
                    }
                })
                .catch((error) => {
                    rej(error);
                }); 
    });
};

exports.countFranchiseProducts = async (where, franchiseId, userType) => {
    let wherepro = {};
    if (userType == 0) {
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,
            is_active: { $ne: "2" }
        };
    } else {
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,
            is_ws_active: { $ne: "2" }
        };
    }

    return new Promise((res, rej) => {
        productsModel.aggregate([
            {
                $lookup: {
                    from: "franchiseproducts",
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$productId", "$$productId"] },
                                franchiseId: franchiseId,
                                is_active: "1"
                            }
                        }
                    ],
                    as: "franchiseproducts",
                }
            },
            { $unwind: { path: "$franchiseproducts" } },
            {
                $match: where,
            },
            {
                $count: "totalCount"  // Count the total number of matching products
            }
        ])
            .then((data) => {
                if (data.length > 0) {
                    res(data[0].totalCount);
                } else {
                    res(0); // No products found
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};
 

exports.NewfranchiseProductsList = async(where, params, franchiseId, userType, userId) => {
    if(userType==0){
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,                                                               
            is_active: {$ne:"2"}   
        } ;
    }else{
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,                                                               
            is_ws_active: {$ne:"2"}   
        } ;
    }
    return new Promise((res, rej) => {

            productsModel
                .aggregate([
                    {
                        $lookup: {
                            from: "franchiseproducts",
                            let: { productId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$productId", "$$productId"] },
                                        franchiseId: franchiseId,
                                        is_active : "1"
                                    },
                                },  
                                {
                                    $project: { isPacket: 1, 
                                                franchiseId: 1, 
                                                productId: 1, 
                                                catId: 1, 
                                                priority: 1, 
                                                product_max_order:1,
                                                product_unit: 1,
                                                product_quality: 1, 
                                                isShown: 1,       
                                                is_active: 1,
                                                max_order: { $cond: { 
                                                      if: { $eq: ["$product_unit", 1] },
                                                      then: {$multiply: ["$product_max_order", 1000] },  
                                                      else: {"$cond": {
                                                            "if": { "$eq": ["$product_unit",3]}, 
                                                            "then":  {$multiply: ["$product_max_order", 1000] }, 
                                                            "else": '$product_max_order'
                                                          }},
                                                    },
                                                  },  
                                            }
                                }
                            ],
                            as: "franchiseproducts",
                        }, 
                    },
                    {
                        $unwind: { path: "$franchiseproducts" },
                    },
                    {
                        $lookup: {
                            from: "frproductvariants",
                            let: { productId: "$_id" },
                            pipeline: [
                                {
                                    $match: wherepro,
                                },  
                                {
                                    $project: {                                                                 
                                        description: 1,
                                        show_default: 1,                                                                
                                        created: 1,
                                        modified: 1,
                                        catId: 1,
                                        productId: 1,
                                        frproductId: 1,
                                        franchiseId: 1,
                                        measurment: 1,
                                        unit: 1,
                                        price: 1,
                                        disc_price: 1,
                                        qty: 1,                                                                
                                        mrp: 1,
                                        wholesale: 1,
                                        is_ws_active:1,
                                        provar_max_order: "$franchiseproducts.product_max_order",
                                        is_active: { 
                                            $cond: {
                                              if: { $eq: [userType, "1"] },
                                              then: '$is_ws_active',
                                              else: '$is_active'                                                                      
                                            },
                                        },
                                        its_unit: {$cond: { 
                                              if: { $eq: ["$unit", 1] },
                                              then: {$multiply: ["$measurment", 1000] },  
                                              else: {"$cond": {
                                                    "if": { "$eq": ["$unit",3]}, 
                                                    "then":  {$multiply: ["$measurment", 1000] }, 
                                                    "else": "$measurment"
                                                  }},
                                            },
                                        }, 
                                        /*its_max_order: { $cond: { 
                                                  if: { $eq: ["$unit", 1] },
                                                  then: {$multiply: ["$provar_max_order", 1000] },  
                                                  else: {"$cond": {
                                                        "if": { "$eq": ["$unit",3]}, 
                                                        "then":  {$multiply: ["$provar_max_order", 1000] }, 
                                                        "else": "$provar_max_order"
                                                      }},
                                                },
                                              }, */ 
                                    }
                                },
                                { $sort : { "mrp":-1,  } },
                            ],
                            as: "productvar",
                        }, 
                    },
                    {
                        $lookup: {
                            from: "productimages",
                            let: { productId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$productId", "$$productId"] },
                                    },
                                },  
                                {
                                    $project: { title: 1, productId: 1, isMain: 1, is_active: 1 }
                                }
                            ],
                            as: "productImg",
                        }, 
                    },
                    {
                        $lookup: {
                            from: "product_wishlists",
                            let: { product_id: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$product_id", "$$product_id"] },
                                        user_id: userId
                                    },
                                },  
                                {
                                    $project: { 
                                        user_id:1,
                                        status: { 
                                            $cond: {
                                              if: { $lt: ["$value", "1"] },
                                              then: 'true',
                                              else: 'false'                                                                      
                                            },
                                        }, }
                                }
                            ],
                            as: "productwishlist",
                        }, 
                    },
                    {
                        $match: where,
                    },
                    {
                        $project: { 
                            "_id":0,
                            "frProductId":"$franchiseproducts._id",
                            title: 1, 
                            catId: 1, 
                            description: 1, 
                            is_active: 1, 
                            "isPacket": "$franchiseproducts.isPacket",
                            "frpro_is_active": "$franchiseproducts.frpro_is_active",
                            "franchiseId": "$franchiseproducts.franchiseId",
                            "productId": "$franchiseproducts.productId",
                            "catId": "$franchiseproducts.catId",
                            "priority": "$franchiseproducts.priority",
                            "product_unit": "$franchiseproducts.product_unit",
                            "product_quality": "$franchiseproducts.product_quality",
                            "isShown": "$franchiseproducts.isShown",
                            "product_max_order": "$franchiseproducts.product_max_order",
                            "max_order": "$franchiseproducts.max_order", 
                            "productwishlist": "$productwishlist",                           
                            "productvar": "$productvar",
                            "productImg": "$productImg",
                            "isproductvar": {$size:"$productvar"}
                        }
                    },  
                    {
                        $match: {$expr:{$gt:["$isproductvar", 0]} },
                    }, 
                    { $sort : { [params.order]:params.dir } },
                    { $skip : params.skip },
                    { $limit : params.limit  },
                ])
                .then((data) => {
                    if (data.length > 0) {
                        res(data);
                    } else {
                        res(null);
                    }
                })
                .catch((error) => {
                    rej(error);
                }); 
    });
};



exports.OfferfranchiseProductsList = async(where, params, franchiseId, userType) => {
    if(userType==0){
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,                                                               
            is_active: "1"   
        } ;
    }else{
        wherepro = {
            $expr: { $eq: ["$productId", "$$productId"] },
            franchiseId: franchiseId,                                                               
            is_ws_active: "1"   
        } ;
    }
    return new Promise((res, rej) => {
        
            offerChildModel
                .aggregate([
                    {
                        $lookup: {
                            from: "products",
                            let: { productId: "$product_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$_id", "$$productId"] }
                                    },
                                },  
                                { $sort: { "product.title": 1 } }, 
                                {
                                    $lookup: {
                                        from: "franchiseproducts",
                                        let: { productId: "$_id" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: { $eq: ["$productId", "$$productId"] },
                                                    franchiseId: franchiseId
                                                },
                                            },  
                                            {
                                                $project: { isPacket: 1, 
                                                            franchiseId: 1, 
                                                            productId: 1, 
                                                            catId: 1, 
                                                            priority: 1, 
                                                            product_max_order:1,
                                                            product_unit: 1,
                                                            product_quality: 1, 
                                                            isShown: 1,       
                                                            is_active: 1,
                                                            max_order: { $cond: { 
                                                                  if: { $eq: ["$product_unit", 1] },
                                                                  then: {$multiply: ["$product_max_order", 1000] },  
                                                                  else: {"$cond": {
                                                                        "if": { "$eq": ["$product_unit",3]}, 
                                                                        "then":  {$multiply: ["$product_max_order", 1000] }, 
                                                                        "else": '$product_max_order'
                                                                      }},
                                                                },
                                                              },  
                                                        }
                                            }
                                        ],
                                        as: "franchiseproducts",
                                    }, 
                                },
                                {
                                    $unwind: { path: "$franchiseproducts" },
                                },
                                {
                                    $lookup: {
                                        from: "frproductvariants",
                                        let: { productId: "$_id" },
                                        pipeline: [
                                            {
                                                $match: wherepro,
                                            },  
                                            {
                                                $project: {                                                                 
                                                    description: 1,
                                                    show_default: 1,                                                                
                                                    created: 1,
                                                    modified: 1,
                                                    catId: 1,
                                                    productId: 1,
                                                    frproductId: 1,
                                                    franchiseId: 1,
                                                    measurment: 1,
                                                    unit: 1,
                                                    price: 1,
                                                    disc_price: 1,
                                                    qty: 1,                                                                
                                                    mrp: 1,
                                                    wholesale: 1,
                                                    is_ws_active:1,
                                                    provar_max_order: "$franchiseproducts.product_max_order",
                                                    is_active: { 
                                                        $cond: {
                                                          if: { $eq: [userType, "1"] },
                                                          then: '$is_ws_active',
                                                          else: '$is_active'                                                                      
                                                        },
                                                    },
                                                    its_unit: {$cond: { 
                                                          if: { $eq: ["$unit", 1] },
                                                          then: {$multiply: ["$measurment", 1000] },  
                                                          else: {"$cond": {
                                                                "if": { "$eq": ["$unit",3]}, 
                                                                "then":  {$multiply: ["$measurment", 1000] }, 
                                                                "else": "$measurment"
                                                              }},
                                                        },
                                                    }, 
                                                    /*its_max_order: { $cond: { 
                                                              if: { $eq: ["$unit", 1] },
                                                              then: {$multiply: ["$provar_max_order", 1000] },  
                                                              else: {"$cond": {
                                                                    "if": { "$eq": ["$unit",3]}, 
                                                                    "then":  {$multiply: ["$provar_max_order", 1000] }, 
                                                                    "else": "$provar_max_order"
                                                                  }},
                                                            },
                                                          }, */ 
                                                }
                                            }
                                        ],
                                        as: "productvar",
                                    }, 
                                },
                                {
                                    $lookup: {
                                        from: "productimages",
                                        let: { productId: "$_id" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: { $eq: ["$productId", "$$productId"] }
                                                },
                                            },  
                                            {
                                                $project: { title: 1, productId: 1, isMain: 1, is_active: 1 }
                                            }
                                        ],
                                        as: "productimages",
                                    }, 
                                },
                                {
                                    $project: { 
                                        title: 1, 
                                        catId: 1, 
                                        description: 1, 
                                        is_active: 1, 
                                        "isPacket": "$franchiseproducts.isPacket",
                                        "frpro_is_active": "$franchiseproducts.frpro_is_active",
                                        "franchiseId": "$franchiseproducts.franchiseId",
                                        "productId": "$franchiseproducts.productId",
                                        "catId": "$franchiseproducts.catId",
                                        "priority": "$franchiseproducts.priority",
                                        "product_unit": "$franchiseproducts.product_unit",
                                        "product_quality": "$franchiseproducts.product_quality",
                                        "isShown": "$franchiseproducts.isShown",
                                        "product_max_order": "$franchiseproducts.product_max_order",
                                        "max_order": "$franchiseproducts.max_order", 
                                         
                                        "productimages": "$productimages",
                                        "productvar": "$productvar",
                                        "isproductvar": {$size:"$productvar"}
                                    }
                                },
                                {
                                    $match: {$expr:{$gt:["$isproductvar", 0]} },
                                }, 
                            ],
                            as: "product",
                        }, 
                    },
                    {
                        $unwind: { path: "$product" },
                    },
                    {
                        $match: where,
                    }, 
                    {
                        $project: { 
                            "_id":1,
                            "offer_id":1,
                            "offer_status":"is_active", 
                            ///"title": "$product.title",                             
                            "product": "$product", 
                        }
                    },  
                    { $sort : { [params.order]:params.dir } }, 
                    { $skip : params.skip },
                    { $limit : params.limit  },
                ])
                .then((data) => {
                    if (data.length > 0) {
                        res(data);
                    } else {
                        res(null);
                    }
                })
                .catch((error) => {
                    rej(error);
                }); 
    });
};
