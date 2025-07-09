const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const { getCookiesConfig } = require("../helpers/formValidConfig");
const Storage = require('../helpers/Storage');
const AdminPermission = require("../models/AdminPermission");

exports.login = async (req, res) => {
  try {
    const { phone_no, password } = req.body;

    // Validate required fields
    console.log("phone_no || !password->", phone_no, password);

    if (!phone_no || !password) {
      return res.badRequest("Phone number and password are required");
    }

    // Find admin user
    const user = await User
      .findOne({
        phone_no: { $eq: phone_no },
        is_active: { $eq: "1" },
        role_type: { $in: ["1", "2", "3"] },
      })
      .select("+password")

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Wrong phone number or account not active",
        data: null,
      });
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Wrong password",
        data: null,
      });
    }

    // Prepare user data
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone_no: user.phone_no,
      dob: user.dob,
      img: user.img,
      role_type: user.role_type,
      is_active: user.is_active,
      franchise_id: user.franchise_id,
    };

    // Generate token
    const token = user?.getToken();
    res.cookie("accessToken", token, getCookiesConfig());

    return res.success({
      authtoken: token,
      user: userData,
    });
  } catch (error) {
    console.error("Admin phone login error:", error);
    return res.someThingWentWrong(error);
  }
};



exports.getProfile = async (req, res) => {
  try {
    let permission = [];
    console.log("req.admin", req.admin);
    let user = req.admin?.toJSON();
    if (user.roleId)
      permission = await AdminPermission.find({ userId: user._id });

    const permissions = permission.reduce((acc, item) => {
      acc[item.module] = item;
      return acc;
    }, {});
    return res.json({
      status: true,
      message: "Successfully..!!",
      data: { user, permissions },
    });
  } catch (error) {
    return res.someThingWentWrong(error);
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { fname, lname, email, phone_no } = req.body;

    req.admin.fname = fname;
    req.admin.lname = lname;
    req.admin.email = email;
    req.admin.phone_no = phone_no;

    if (req.file) {
      req.admin.img =  process.env.FILEURL + "profile/" + req.file.filename; 
    }

    await req.admin.save();

    return res.json({
      status: true,
      message: "Profile Updated Successfully..!!",
      data: { user: req.admin.toJSON(), permissions: {} },
    });

  } catch (error) {
    return res.someThingWentWrong(error);
  }
};

exports.changeProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.badRequest("Please provide image file.");
    }

    if (req.admin?.img) {
      Storage.deleteFile(req.admin.img);
    }

    const updatedAdmin = await User.findOneAndUpdate(
      { _id: req.admin_id, deletedAt: null },
      { $set: { img: process.env.FILEURL + "profile/" + req.file.filename } },
      { new: true }
    );

    if (updatedAdmin) {
      return res.successUpdate({ user: updatedAdmin });
    } else {
      return res.noRecords();
    }
  } catch (error) {
    return res.someThingWentWrong(error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password, new_password } = req.body;

    if (!bcrypt.compareSync(password, req.admin.password)) {
      return res.badRequest("Invalid Old Password..!!");
    }

    if (bcrypt.compareSync(new_password, req.admin.password)) {
      return res.badRequest("New Password can't be same as Old Password..!!");
    }

    if (!req.admin.is_active) {
      return res.badRequest("Your account is blocked..!!");
    }

    req.admin.password = bcrypt.hashSync(new_password, 10);
    await req.admin.save();

    return res.successUpdate([], "Password Changed Successfully..!!");
  } catch (error) {
    return res.someThingWentWrong(error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("accessToken", "", getCookiesConfig());
    res.cookie("token_type", "", getCookiesConfig());
    res
      .status(200)
      .send({ status: true, message: "Logout successful", data: [] });
  } catch (error) {
    return res.someThingWentWrong(error);
  }
};
