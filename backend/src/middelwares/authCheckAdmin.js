const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("../models/Role");
const { INVALID_ACCESS_TOKEN, INVALID_USER } = require("../languages/english");

module.exports = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken || req.headers["authorization"];

    if (!token)
      return res.status(401).send({
        status: false,
        message: "No token provided.!!",
        data: [],
      });

    var decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.ENCRYPTION_KEY
    );

    let admin = await User.findOne({
      _id: decoded.subject,
      deletedAt: null,
    }).populate("roleId");
    if (!admin)
      return res.status(401).json({
        status: false,
        message: INVALID_USER,
        data: [],
      });
      
    if (!admin.is_active)
      return res.status(401).json({
        status: false,
        message: "Admin account is blocked..!!",
        data: [],
      });

    req.admin = admin;
    req.admin_id = admin._id;
    req.role = admin.roleId?.name || "admin";
    next();
  } catch (error) {
    console.error("Admin auth check error:", error);
    return res.status(401).send({
      status: false,
      message: INVALID_ACCESS_TOKEN,
      data: error.message,
    });
  }
};
