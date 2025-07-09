const responseObj = {}
const mongodb = require("mongodb");
const jwt = require('jsonwebtoken');
const userDatalayer = require("../datalayers/userDatalayer");
const errorCodes = require("../helpers/error_codes/errorCodes");
const messageLangauage = require("../helpers/languages/english");

exports.validate = (request, response, next) => {
    if (request.headers.authorization) {
        const token = request.headers.authorization.split(' ')[1];
        if (token === 'null') {
            responseObj.sucess = errorCodes.UNAUTHORIZED
            responseObj.msg = messageLangauage.SOMETHING_WENT_WRONG;
            responseObj.data = {}
            response.send(responseObj)
            return
        }

        const secretKey = process.env.ENCRYPTION_KEY;
        const payload = jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                responseObj.sucess = errorCodes.UNAUTHORIZED;
                responseObj.msg = messageLangauage.INVALID_ACCESS_TOKEN;
                responseObj.data = {};
                response.send(responseObj);
                return;
            }

            if (!decoded || !decoded.subject) {
                responseObj.sucess = errorCodes.UNAUTHORIZED;
                responseObj.msg = messageLangauage.INVALID_ACCESS_TOKEN;
                responseObj.data = {};
                response.send(responseObj);
                return;
            }

            response.locals._id = decoded.subject;
            /* get logged in user info */
            ///console.log("@@"+mongodb.ObjectId(decoded.subject));
            userDatalayer.getUserById(mongodb.ObjectId(decoded.subject))
                .then((user) => {
                    if (user.length) {
                        if (user[0].is_active == '1') {
                            request.user = user[0];
                            response.locals.user = user[0];
                            next();
                        } else {
                            responseObj.sucess = errorCodes.UNAUTHORIZED;
                            responseObj.msg = "Your acount is not active, Please contact "+process.env.APPNAME+" support team at +918010981098";
                            responseObj.data = {};
                            response.send(responseObj);
                            return;
                        }
                    } else {
                        responseObj.sucess = errorCodes.UNAUTHORIZED;
                        responseObj.msg = messageLangauage.ACCESS_TOKEN_MISSING;
                        responseObj.data = {};
                        response.send(responseObj);
                        return;
                    }
                })
                .catch((error) => {
                    ///console.log(error)
                    responseObj.sucess = errorCodes.UNAUTHORIZED
                    responseObj.msg = messageLangauage.SOMETHING_WENT_WRONG;
                    responseObj.data = {}
                    response.send(responseObj)
                    return
                });
            /* get logged in user info */
        });
    } else {
        responseObj.sucess = errorCodes.BAD_REQUEST;
        responseObj.msg = messageLangauage.ACCESS_TOKEN_MISSING;
        responseObj.data = {};
        response.send(responseObj);
    }
}