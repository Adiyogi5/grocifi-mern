const modulesDatalayers = require('../modules/Modules');
 

exports.getallmodule = async(where) => {
    return new Promise((res, rej) => { 
        modulesDatalayers.find(where)
        .then((data) => {
            res(data);
        }).catch((err) => {
            rej(err);
        }) 
    });
};
 
 