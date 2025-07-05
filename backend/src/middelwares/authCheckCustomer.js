
const { INVALID_ACCESS_TOKEN, INVALID_USER } = require("../languages/english");

module.exports = async (req, res, next) => {
    try {
        
        let token = req.cookies.accessToken || req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided.", data: [] });
        }
 
        let user = req.admin

        if (!user) {
            return res.status(401).json({
                status: false,
                message: INVALID_USER,
                data: []
            });
        }

        if (!user.status) {
            return res.status(401).json({
                status: false,
                message: "Customer account is blocked.",
                data: []
            });
        }
        next();
    } catch (error) {
        
        return res.status(401).json({ status: false, message: INVALID_ACCESS_TOKEN, data: error.message });
    }
};
