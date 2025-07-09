const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, Role, Franchise } = require("../models/index");
const AggregationService = require("../helpers/AggregationService");
const Storage = require("../helpers/Storage");
const { generateUniqueReferCode } = require("../helpers/utils");
const { ObjectId } = mongoose.Types;

const createFromHexString = (id) => ObjectId.createFromHexString(id);

module.exports = {
  listSubAdmins: async (req, res) => {
    try {
      const { limit, pageNo, query, orderBy, orderDirection } = req.query;
      const role = await Role.findOne({ name: "Admin" });
      if (!role) {
        return res.noRecords();
      }
      const conditions = { roleId: role._id, deletedAt: null };
      if (query) {
        conditions.$or = [
          { fname: { $regex: query, $options: "i" } },
          { lname: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { phone_no: { $regex: query, $options: "i" } },
        ];
      }
      const records = await User.find(conditions)
        .populate("roleId")
        .sort({ [orderBy]: orderDirection === -1 ? -1 : 1 })
        .skip((pageNo - 1) * limit)
        .limit(parseInt(limit));
      const total = await User.countDocuments(conditions);
      return res.pagination(records, total, parseInt(limit), parseInt(pageNo));
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getAddSubAdmin: async (req, res) => {
    try {
      const roles = await Role.find({ name: "Admin", deletedAt: null });
      return res.success(roles);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  addSubAdmin: async (req, res) => {
    try {
        const referCode = await generateUniqueReferCode();
      const { fname, lname, email, phone_no, password, roleId } = req.body;
      const existingUser = await User.findOne({
        $or: [{ email }, { phone_no }],
        deletedAt: null,
      });
      if (existingUser) {
        return res.badRequest(
          "User with this email or phone number already exists"
        );
      }
      const user = new User({
        fname,
        lname,
        email,
        phone_no,
        password: await bcrypt.hash(password, 10),
        roleId,
        img: req.file ? process.env.FILEURL + "profile/" + req.file.filename : "noimage.png",
         refer_code: referCode, 
        createdby: req.admin._id,
        modifiedby: req.admin._id,
      });
      await user.save();
      return res.successInsert(user);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getEditSubAdmin: async (req, res) => {
    try {
      const user = await User.findById(
        createFromHexString(req.params.id)
      ).populate("roleId");
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const roles = await Role.find({ name: "Admin", deletedAt: null });
      return res.success({ user, roles });
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  updateSubAdmin: async (req, res) => {
    try {
      const { fname, lname, email, phone_no } = req.body;
      const user = await User.findById(createFromHexString(req.params.id));
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const updateData = {
        fname,
        lname,
        email,
        phone_no,
        modified: new Date(),
        modifiedby: req.admin._id,
      };
      if (req.file) {
        updateData.img = process.env.FILEURL + "profile/" + req.file.filename;
      }
      const updatedUser = await User.findByIdAndUpdate(
        createFromHexString(req.params.id),
        { $set: updateData },
        { new: true }
      );
      return res.successUpdate(updatedUser);
    } catch (error) {
      console.log("error", error)
      return res.someThingWentWrong(error);
    }
  },

  // Franchise Management
  listFranchises: async (req, res) => {
    try {
      const { limit, pageNo, query, orderBy, orderDirection } = req.query;
      const conditions = { deletedAt: null };
      if (query) {
        conditions.$or = [
          { firmname: { $regex: query, $options: "i" } },
          { ownername: { $regex: query, $options: "i" } },
          { ownermobile: { $regex: query, $options: "i" } },
          { contactpersonname: { $regex: query, $options: "i" } },
        ];
      }
      const agg = new AggregationService(Franchise)
        .match(conditions)
        .lookup([
          {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        ])
        .unwind(["$userId"])
        .sort(orderBy, orderDirection === -1 ? "desc" : "asc")
        .facet()
        .paginate((pageNo - 1) * limit, parseInt(limit));
      const result = await agg.execute();
      const records = result[0]?.records || [];
      const total = result[0]?.total?.[0]?.count || 0;
      return res.pagination(records, total, parseInt(limit), parseInt(pageNo));
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getAddFranchise: async (req, res) => {
    try {
      return res.success({});
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  addFranchise: async (req, res) => {
        const referCode = await generateUniqueReferCode();

    try {
      const {
        fname,
        lname,
        email,
        phone_no,
        password,
        firmname,
        ownername,
        ownermobile,
        contactpersonname,
        contactpersonmob,
        commission,
        is_global,
        is_cod,
        isallow_global_product,
        min_order,
        min_order_wholesaler,
        delivery_chrge,
        accept_minimum_order,
        delivery_day_after_order,
        delivery_max_day,
      } = req.body;
      const existingUser = await User.findOne({
        $or: [{ email }, { phone_no }],
        deletedAt: null,
      });
      if (existingUser) {
        return res.badRequest(
          "User with this email or phone number already exists"
        );
      }
      const role = await Role.findOne({ name: "Franchise" });
      if (!role) {
        return res.badRequest("Franchise role not found");
      }
      const user = new User({
        fname,
        lname,
        email,
        phone_no,
        password: await bcrypt.hash(password, 10),
        roleId: role._id,
        img: req.files["image"]
          ? process.env.FILEURL + "profile/" + req.files["image"][0].filename
          : "noimage.png",
          refer_code: referCode,
        createdby: req.admin._id,
        modifiedby: req.admin._id,
      });
      await user.save();
      const franchise = new Franchise({
        userId: user._id,
        firmname,
        ownername,
        ownermobile,
        contactpersonname,
        contactpersonmob,
        commission,
        is_global: is_global === "true",
        is_cod: is_cod === "true",
        isallow_global_product: isallow_global_product === "true",
        min_order,
        min_order_wholesaler,
        delivery_chrge,
        accept_minimum_order: accept_minimum_order === "true",
        delivery_day_after_order: parseInt(delivery_day_after_order),
        delivery_max_day: parseInt(delivery_max_day),
        logo: req.files["logo"] ? process.env.FILEURL + "franchise/" + req.files["logo"][0].filename : null,
        createdby: req.admin._id,
        modifiedby: req.admin._id,
      });
      await franchise.save();
      return res.successInsert({ user, franchise });
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getEditFranchise: async (req, res) => {
    try {
      const franchise = await Franchise.findById(
        createFromHexString(req.params.id)
      ).populate("userId");
      if (!franchise || franchise.deletedAt) {
        return res.noRecords();
      }
      return res.success(franchise);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  updateFranchise: async (req, res) => {
        const referCode = await generateUniqueReferCode();
    try {
      const {
        fname,
        lname,
        email,
        phone_no,
        firmname,
        ownername,
        ownermobile,
        contactpersonname,
        contactpersonmob,
        commission,
        is_global,
        is_cod,
        isallow_global_product,
        min_order,
        min_order_wholesaler,
        delivery_chrge,
        accept_minimum_order,
        delivery_day_after_order,
        delivery_max_day,
      } = req.body;
      const franchise = await Franchise.findById(
        createFromHexString(req.params.id)
      );
      if (!franchise || franchise.deletedAt) {
        return res.noRecords();
      }
      if (!franchise.userId) {
        return res.noRecords();
      }
      const user = await User.findById(franchise.userId);
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const updateUserData = {
        fname,
        lname,
        email,
        phone_no,
        refer_code: referCode,
        modified: new Date(),
        modifiedby: req.admin._id,
      };
      if (req.files["image"]) {
        updateUserData.img = process.env.FILEURL + "profile/" + req.files["image"][0].filename;
      }
      await User.findByIdAndUpdate(user._id, { $set: updateUserData });
      const updateFranchiseData = {
        firmname,
        ownername,
        ownermobile,
        contactpersonname,
        contactpersonmob,
        commission,
        is_global: is_global === "true",
        is_cod: is_cod === "true",
        isallow_global_product: isallow_global_product === "true",
        min_order,
        min_order_wholesaler,
        delivery_chrge,
        accept_minimum_order: accept_minimum_order === "true",
        delivery_day_after_order: parseInt(delivery_day_after_order),
        delivery_max_day: parseInt(delivery_max_day),
        modified: new Date(),
        modifiedby: req.admin._id,
      };
      if (req.files["logo"]) {
        updateFranchiseData.logo = process.env.FILEURL + "franchise/" + req.files["logo"][0].filename;
      }
      const updatedFranchise = await Franchise.findByIdAndUpdate(
        createFromHexString(req.params.id),
        { $set: updateFranchiseData },
        { new: true }
      );
      return res.successUpdate(updatedFranchise);
    } catch (error) {
      console.log("error", error);
      return res.someThingWentWrong(error);
    }
  },

  // Customer Management
  listCustomers: async (req, res) => {
    try {
      const { limit, pageNo, query, orderBy, orderDirection } = req.query;
      const role = await Role.findOne({ name: "Customer" });
      if (!role) {
        return res.noRecords();
      }
      const conditions = { roleId: role._id, deletedAt: null };
      if (query) {
        conditions.$or = [
          { fname: { $regex: query, $options: "i" } },
          { lname: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { phone_no: { $regex: query, $options: "i" } },
        ];
      }
      const records = await User.find(conditions)
        .populate("roleId")
        .sort({ [orderBy]: orderDirection === -1 ? -1 : 1 })
        .skip((pageNo - 1) * limit)
        .limit(parseInt(limit));
      const total = await User.countDocuments(conditions);
      return res.pagination(records, total, parseInt(limit), parseInt(pageNo));
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getAddCustomer: async (req, res) => {
    try {
      const roles = await Role.find({ name: "Customer", deletedAt: null });
      return res.success(roles);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  addCustomer: async (req, res) => {
    try {
              const referCode = await generateUniqueReferCode();

      const { fname, lname, email, phone_no, password } = req.body;
      const existingUser = await User.findOne({
        $or: [{ email }, { phone_no }],
        deletedAt: null,
      });
      if (existingUser) {
        return res.badRequest(
          "User with this email or phone number already exists"
        );
      }
      const role = await Role.findOne({ name: "Customer" });
      if (!role) {
        return res.badRequest("Customer role not found");
      }
      const user = new User({
        fname,
        lname,
        email,
        phone_no,
        password: await bcrypt.hash(password, 10),
        roleId: role._id,
        img: req.file ? process.env.FILEURL + "profile/" + req.file.filename : "noimage.png",
        refer_code: referCode,
        createdby: req.admin._id,
        modifiedby: req.admin._id,
      });
      await user.save();
      return res.successInsert(user);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getEditCustomer: async (req, res) => {
    try {
      const user = await User.findById(
        createFromHexString(req.params.id)
      ).populate("roleId");
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const roles = await Role.find({ name: "Customer", deletedAt: null });
      return res.success({ user, roles });
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const { fname, lname, email, phone_no } = req.body;
      const user = await User.findById(createFromHexString(req.params.id));
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const updateData = {
        fname,
        lname,
        email,
        phone_no,
        modified: new Date(),
        modifiedby: req.admin._id,
      };
      if (req.file) {
        updateData.img = process.env.FILEURL + "profile/" + req.file.filename;
      }
      const updatedUser = await User.findByIdAndUpdate(
        createFromHexString(req.params.id),
        { $set: updateData },
        { new: true }
      );
      return res.successUpdate(updatedUser);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

listWholesalers: async (req, res) => {
    try {
        const { limit, pageNo, query, orderBy, orderDirection } = req.query;
        const role = await Role.findOne({ name: "Customer" });
        if (!role) {
            return res.noRecords('Customer role not found');
        }
        const conditions = {
            roleId: role._id,
            deletedAt: null,
        };
        if (query) {
            conditions.$or = [
                { fname: { $regex: query, $options: "i" } },
                { lname: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { phone_no: { $regex: query, $options: "i" } },
                { wholesaler_firmname: { $regex: query, $options: "i" } },
                { gst_no: { $regex: query, $options: "i" } }
            ];
        }
        const agg = new AggregationService(User)
            .match(conditions)
            .lookup([
                {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "roleId",
                },
            ])
            .unwind(["$roleId"])
            .sort(orderBy, orderDirection === '-1' ? "desc" : "asc")
            .facet()
            .paginate((pageNo - 1) * limit, parseInt(limit));
        const result = await agg.execute();
        const records = result[0]?.records || [];
        const total = result[0]?.total?.[0]?.count || 0;
        return res.pagination(records, total, parseInt(limit), parseInt(pageNo));
    } catch (error) {
        return res.someThingWentWrong(error);
    }
},

// Get data for add wholesaler
getAddWholesaler: async (req, res) => {
    try {
        const roles = await Role.find({ name: "Customer", deletedAt: null });
        return res.success(roles);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
},

// Add wholesaler
addWholesaler: async (req, res) => {
    try {
        const referCode = await generateUniqueReferCode();
        const { fname, lname, email, phone_no, password, wholesaler_firmname, gst_no } = req.body;
        const existingUser = await User.findOne({
            $or: [{ email }, { phone_no }],
            deletedAt: null,
        });
        if (existingUser) {
            return res.badRequest("User with this email or phone number already exists");
        }
        const role = await Role.findOne({ name: "Customer" });
        if (!role) {
            return res.badRequest("Customer role not found");
        }
        const user = new User({
            fname,
            lname,
            email,
            phone_no,
            password: await bcrypt.hash(password, 10),
            roleId: role._id,
            wholesaler_firmname,
            gst_no,
            img: req.files?.img ? process.env.FILEURL + "profile/" + req.files.img[0].filename : "noimage.png",
            visiting_card: req.files?.visiting_card ? process.env.FILEURL + "visiting_card/" + req.files.visiting_card[0].filename : null,
            refer_code: referCode,
            createdby: req.admin._id,
            modifiedby: req.admin._id,
        });
        await user.save();
        return res.successInsert(user);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
},

// Get data for edit wholesaler
getEditWholesaler: async (req, res) => {
  try {
    const user = await User.findById(
      createFromHexString(req.params.id)
    ).populate("roleId");
    if (!user || user.deletedAt) {
      return res.noRecords();
    }
    const roles = await Role.find({ name: "Customer", deletedAt: null });
    return res.success({ user, roles });
  } catch (error) {
    return res.someThingWentWrong(error);
  }
},

// Update wholesaler
updateWholesaler: async (req, res) => {
    try {
        const { fname, lname, email, phone_no, wholesaler_firmname, gst_no } = req.body;
        const user = await User.findById(createFromHexString(req.params.id));
        if (!user || user.deletedAt) {
            return res.noRecords();
        }
        const updateData = {
            fname,
            lname,
            email,
            phone_no,
            wholesaler_firmname,
            gst_no,
            modified: new Date(),
            modifiedby: req.admin._id,
        };
        if (req.files?.img) {
            updateData.img = process.env.FILEURL + "profile/" + req.files.img[0].filename;
        }
        if (req.files?.visiting_card) {
            updateData.visiting_card = process.env.FILEURL + "visiting_card/" + req.files.visiting_card[0].filename;
        }
        const updatedUser = await User.findByIdAndUpdate(
            createFromHexString(req.params.id),
            { $set: updateData },
            { new: true }
        );
        return res.successUpdate(updatedUser);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
},

// View wholesaler
viewWholesaler: async (req, res) => {
  try {
    const roles = await Role.find({ name: "Customer", deletedAt: null });
    return res.success(roles);
  } catch (error) {
    return res.someThingWentWrong(error);
  }
},
  // Delivery Boy Management
  listDeliveryBoys: async (req, res) => {
    try {
      const { limit, pageNo, query, orderBy, orderDirection } = req.query;
      const role = await Role.findOne({ name: "Delivery Boy" });
      if (!role) {
        return res.noRecords();
      }
      const conditions = { roleId: role._id, deletedAt: null };
      if (query) {
        conditions.$or = [
          { fname: { $regex: query, $options: "i" } },
          { lname: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { phone_no: { $regex: query, $options: "i" } },
        ];
      }
      const records = await User.find(conditions)
        .populate("roleId")
        .sort({ [orderBy]: orderDirection === -1 ? -1 : 1 })
        .skip((pageNo - 1) * limit)
        .limit(parseInt(limit));
      const total = await User.countDocuments(conditions);
      return res.pagination(records, total, parseInt(limit), parseInt(pageNo));
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getAddDeliveryBoy: async (req, res) => {
    try {
      const roles = await Role.find({ name: "Delivery Boy", deletedAt: null });
      return res.success(roles);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  addDeliveryBoy: async (req, res) => {
    try {
      const referCode = await generateUniqueReferCode();
      const { fname, lname, email, phone_no, password } = req.body;
      const existingUser = await User.findOne({
        $or: [{ email }, { phone_no }],
        deletedAt: null,
      });
      if (existingUser) {
        return res.badRequest(
          "User with this email or phone number already exists"
        );
      }
      const role = await Role.findOne({ name: "Delivery Boy" });
      if (!role) {
        return res.badRequest("Delivery Boy role not found");
      }
      const user = new User({
        fname,
        lname,
        email,
        phone_no,
        password: await bcrypt.hash(password, 10),
        roleId: role._id,
        img: req.file ? process.env.FILEURL + "profile/" + req.file.filename : "noimage.png",
        refer_code: referCode,
        createdby: req.admin._id,
        modifiedby: req.admin._id,
      });
      await user.save();
      return res.successInsert(user);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  getEditDeliveryBoy: async (req, res) => {
    try {
      const user = await User.findById(
        createFromHexString(req.params.id)
      ).populate("roleId");
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const roles = await Role.find({ name: "Delivery Boy", deletedAt: null });
      return res.success({ user, roles });
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },

  updateDeliveryBoy: async (req, res) => {
    try {
      const { fname, lname, email, phone_no } = req.body;
      const user = await User.findById(createFromHexString(req.params.id));
      if (!user || user.deletedAt) {
        return res.noRecords();
      }
      const updateData = {
        fname,
        lname,
        email,
        phone_no,
        modified: new Date(),
        modifiedby: req.admin._id,
      };
      if (req.file) {
        updateData.img = process.env.FILEURL + "profile/" + req.file.filename;
      }
      const updatedUser = await User.findByIdAndUpdate(
        createFromHexString(req.params.id),
        { $set: updateData },
        { new: true }
      );
      return res.successUpdate(updatedUser);
    } catch (error) {
      return res.someThingWentWrong(error);
    }
  },
};
