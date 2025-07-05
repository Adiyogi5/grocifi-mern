const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const { getCookiesConfig } = require("../helpers/formValidConfig");

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate required fields
//     if (!email || !password) {
//       return res.badRequest("Email and password are required");
//     }

//     // Find admin user
//     const user = await User
//       .findOne({
//         email: { $eq: email },
//         is_active: { $eq: "1" },
//         role_type: { $in: ["1", "2", "3"] },
//       })
//       .select("+password")
//       .lean();

//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         message: "Wrong email or account not active",
//         data: null,
//       });
//     }

//     // Verify password
//     const isPasswordValid = bcrypt.compareSync(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         status: false,
//         message: "Wrong password",
//         data: null,
//       });
//     }

//     // Prepare user data
//     const userData = {
//       _id: user._id,
//       fname: user.fname,
//       lname: user.lname,
//       email: user.email,
//       dob: user.dob,
//       img: user.img,
//       role_type: user.role_type,
//       is_active: user.is_active,
//       phone_no: user.phone_no,
//     };

//     // Generate token
//     const token = user.getToken();
//     res.cookie("accessToken", token, getCookiesConfig());

//     return res.success({
//       authtoken: token,
//       user: userData,
//     });
//   } catch (error) {
//     console.error("Admin login error:", error);
//     return res.someThingWentWrong(error);
//   }
// };

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
