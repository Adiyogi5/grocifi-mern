const searchDatalayers = require('../datalayers/SearchDatalayers');
const message = require("../helpers/languages/english");
const errorsCodes = require("../helpers/error_codes/errorCodes");



exports.productsDetail = async (req, res) => {

    var param = req.body;
    var cat_id = param.cat_id;
    var title = param.title;
    var titleLength = title.length;
    
    if (titleLength >= 3) {
        var result = [];
        var x = await searchDatalayers.productDetail();
        try {
            // x = x.filter((elem) => {          //Getting All The Data on the basis of catagory id 
            //     if (elem._id == cat_id) {
            //         return elem
            //     }
            // });
            x.filter((elem) => {
                let searchElem = elem.products.title.substring(0, titleLength);
                if (elem._id == cat_id && searchElem.toLowerCase() == title.toLowerCase()) {
                    result.push(elem)
                }
            });
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result
            })

        } catch (error) {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record(s) not found.",
                error: error
            })

        }

    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Title Length Short",
            Minimum_Length_Required: 3

        })
    }

}

