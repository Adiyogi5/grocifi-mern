const moment = require("moment");
const bcrypt = require("bcrypt");

exports.add530 = async(val_date = '') => {
    if (val_date != '') {
        val_date = new Date();
    }
    return moment(val_date).add(5, "hours").add(30, "minutes");
}


exports.encryptPassword = async(password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        })
    })
}

exports.comparePassword = async(password) => {
    return new Promise(((resolve, reject) => {
        bcrypt.compare(password.plainPassword, password.encryptedPassword, ((err, isSame) => {
            if (err) {
                reject(err);
            } else if (!isSame) {
                reject(new Error('User and Password Does not Match'));
            } else {
                resolve(true);
            }
        }))
    }))
}

function toRad(Value) {
    return Value * Math.PI / 180;
}

exports.calculateDistance = async(lat_long) => {
    //return new Promise(((res, rej) => {}))

    let lat1 = 26.295906242592118;
    let lon1 = 73.04140089841285;
    let lat2 = lat_long.lat;
    let lon2 = lat_long.long;

    var R = 6371; // km
    let dLat = toRad(lat2 - lat1);
    let dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;

}