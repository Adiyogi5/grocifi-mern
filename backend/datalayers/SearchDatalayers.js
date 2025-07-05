const catSubcatModel = require('../modules/Catagory');
const mongoose = require('mongoose');

exports.productDetail = async () => {
  return new Promise((res, rej) => {
    catSubcatModel
      .aggregate(
        [
          {
              '$lookup': {
                  'from': 'products', 
                  'localField': '_id', 
                  'foreignField': 'catId', 
                  'as': 'products'
              }
          }, {
              '$unwind': {
                  'path': '$products'
              }
          }, 
          {
              '$lookup': {
                  'from': 'franchiseproducts', 
                  'localField': 'products._id', 
                  'foreignField': 'productId', 
                  'as': 'franchiseproducts_isPacket'
              }
          },
           {
              '$lookup': {
                  'from': 'productimages', 
                  'localField': 'products._id', 
                  'foreignField': 'productId', 
                  'as': 'franchiseproducts_Images'
              }
          }, {
              '$lookup': {
                  'from': 'frproductvariants', 
                  'localField': 'products._id', 
                  'foreignField': 'productId', 
                  'as': 'productVariants'
              }
          }, 
          {
              '$project': {
                  'title': 1, 
                  'catagory_img': 1, 
                  'description': 1, 
                  'products': 1, 
                  'productimages': 1, 
                  'productVariants': 1, 
                  'franchiseproducts_isPacket': 1, 
                  'franchiseproducts_Images': 1
              }
          }
      ]
        // [
        //   {
        //     '$lookup': {
        //       'from': 'products',
        //       'localField': '_id',
        //       'foreignField': 'catId',
        //       'as': 'products'
        //     }
        //   }, {
        //     '$unwind': {
        //       'path': '$products'
        //     }
        //   }, 
        //   {
        //     '$lookup':
        //     {
              
        //         "from": 'franchiseproducts',
        //         "localField": 'products._id',
        //         "foreignField": 'productId',
        //         "as": 'franchiseproducts_isPacket'
               
        //     }

        //   },
        //   {
        //     '$lookup': {
        //       'from': 'productimages',
        //       'localField': 'products._id',
        //       'foreignField': 'productId',
        //       'as': 'productimages'
        //     }
        //   }, {
        //     '$lookup': {
        //       'from': 'frproductvariants',
        //       'localField': 'products._id',
        //       'foreignField': 'productId',
        //       'as': 'productVariants'
        //     }
        //   }, {
        //     '$project': {
        //       "title": 1,
        //       "catagory_img": 1,
        //       "description": 1,
        //       "products": 1,
        //       "productimages": 1,
        //       "productVariants": 1
        //     }
        //   }
        // ]
        )
      .then((doc) => {
        res(doc)
      })
      .catch((err) => {
        rej(err)
      });
  });
};
