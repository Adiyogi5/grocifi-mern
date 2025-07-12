const router = require("express").Router();
const { showValidationErrors, authCheckAdmin } = require("../../middelwares");
const checkValid = require("../../middelwares/validator");
const Constants = require("../../helpers/constant");
const Storage = require("../../helpers/Storage");

const adminController = require("../../controllers/adminController");
const userManagementController = require("../../controllers/userManagementController");
const generalSettingsController = require("../../controllers/generalSettingsController");
const roleController = require("../../controllers/roleController");

const upload = new Storage.uploadTo({ dir: "profile", isImage: true });
const uploadSettings = new Storage.uploadTo({ dir: "settings", isImage: true });

// Authentication
router.post("/login", adminController.login);
// router.post('/login-with-phone', adminController.adminPhoneLogin);

// Protected Routes ..........................
router.use(authCheckAdmin);
router.get("/logout", adminController.logout);
router.get("/profile", adminController.getProfile);
router.post(
  "/update-profile",
  upload.single("image"),
  checkValid("updateProfile"),
  showValidationErrors,
  adminController.updateProfile
);
router.post(
  "/change-profile-image",
  upload.single("image"),
  adminController.changeProfileImage
);
router.post(
  "/change-password",
  checkValid("changePassword"),
  showValidationErrors,
  adminController.changePassword
);

// User Management Routes
// Admin and Sub-Admin .......................
router.get("/subadmin", userManagementController.listSubAdmins);
router.get("/subadmin/add", userManagementController.getAddSubAdmin);
router.post(
  "/subadmin/add",
  upload.single("image"),
  checkValid("addSubAdmin"),
  showValidationErrors,
  userManagementController.addSubAdmin
);
router.get("/subadmin/edit/:id", userManagementController.getEditSubAdmin);
router.post(
  "/subadmin/edit/:id",
  upload.single("image"),
  checkValid("updateSubAdmin"),
  showValidationErrors,
  userManagementController.updateSubAdmin
);
router.delete("/subadmin/delete/:id", generalSettingsController.commonDelete);
router.post(
  "/subadmin/delete-multiple",
  generalSettingsController.commonMultipleDelete
);
router.delete(
  "/subadmin/toggle-status/:id",
  generalSettingsController.toggleStatus
);

// Franchise
router.get("/franchise", userManagementController.listFranchises);
router.get("/franchise/add", userManagementController.getAddFranchise);
router.post(
  "/franchise/add",
  Storage.multiUpload.fields([
    { name: "image", maxCount: 1, dir: "profile" },
    { name: "logo", maxCount: 1, dir: "franchise" },
  ]),
  checkValid("addFranchise"),
  showValidationErrors,
  userManagementController.addFranchise
);
router.get("/franchise/edit/:id", userManagementController.getEditFranchise);
router.post(
  "/franchise/edit/:id",
  Storage.multiUpload.fields([
    { name: "image", maxCount: 1, dir: "profile" },
    { name: "logo", maxCount: 1, dir: "franchise" },
  ]),
  checkValid("updateFranchise"),
  showValidationErrors,
  userManagementController.updateFranchise
);
router.delete("/franchise/delete/:id", generalSettingsController.commonDelete);
router.post(
  "/franchise/delete-multiple",
  generalSettingsController.commonMultipleDelete
);
router.delete(
  "/franchise/toggle-status/:id",
  generalSettingsController.toggleStatus
);

// Customer
router.get("/customer", userManagementController.listCustomers);
router.get("/customer/add", userManagementController.getAddCustomer);
router.post(
  "/customer/add",
  Storage.multiUpload.fields([
    { name: "image", maxCount: 1, dir: "profile" },
    { name: "visiting_card", maxCount: 1, dir: "visiting_card" },
  ]),
  checkValid("addCustomer"),
  showValidationErrors,
  userManagementController.addCustomer
);
router.get("/customer/edit/:id", userManagementController.getEditCustomer);
router.post(
  "/customer/edit/:id",
   Storage.multiUpload.fields([
    { name: "image", maxCount: 1, dir: "profile" },
    { name: "visiting_card", maxCount: 1, dir: "visiting_card" },
  ]),
  checkValid("updateCustomer"),
  showValidationErrors,
  userManagementController.updateCustomer
);
router.delete("/customer/delete/:id", generalSettingsController.commonDelete);
router.post(
  "/customer/delete-multiple",
  generalSettingsController.commonMultipleDelete
);
router.delete(
  "/customer/toggle-status/:id",
  generalSettingsController.toggleStatus
);

// Wholesaler
router.get("/wholesaler", userManagementController.listWholesalers);
router.get("/wholesaler/add", userManagementController.getAddWholesaler);
router.post(
  "/wholesaler/add",
  Storage.multiUpload.fields([
    { name: "img", maxCount: 1, dir: "profile" },
    { name: "visiting_card", maxCount: 1, dir: "visiting_card" },
  ]),
  checkValid("addWholesaler"),
  showValidationErrors,
  userManagementController.addWholesaler
);
router.get("/wholesaler/edit/:id", userManagementController.getEditWholesaler);
router.post(
  "/wholesaler/edit/:id",
  Storage.multiUpload.fields([
    { name: "img", maxCount: 1, dir: "profile" },
    { name: "visiting_card", maxCount: 1, dir: "visiting_card" },
  ]),
  checkValid("updateWholesaler"),
  showValidationErrors,
  userManagementController.updateWholesaler
);
router.delete("/wholesaler/delete/:id", generalSettingsController.commonDelete);
router.post(
  "/wholesaler/delete-multiple",
  generalSettingsController.commonMultipleDelete
);
router.delete(
  "/wholesaler/toggle-status/:id",
  generalSettingsController.toggleStatus
);

// Delivery Boys
router.get("/delivery-boys", userManagementController.listDeliveryBoys);
router.get("/delivery-boys/add", userManagementController.getAddDeliveryBoy);
router.post(
  "/delivery-boys/add",
  upload.single("image"),
  checkValid("addDeliveryBoy"),
  showValidationErrors,
  userManagementController.addDeliveryBoy
);
router.get(
  "/delivery-boys/edit/:id",
  userManagementController.getEditDeliveryBoy
);
router.post(
  "/delivery-boys/edit/:id",
  upload.single("image"),
  checkValid("updateDeliveryBoy"),
  showValidationErrors,
  userManagementController.updateDeliveryBoy
);
router.delete(
  "/delivery-boys/delete/:id",
  generalSettingsController.commonDelete
);
router.post(
  "/delivery-boys/delete-multiple",
  generalSettingsController.commonMultipleDelete
);
router.delete(
  "/delivery-boys/toggle-status/:id",
  generalSettingsController.toggleStatus
);

router.get("/role-datatable", roleController.list_json);
router.get("/role", roleController.list);
router.get("/role/:id", roleController.getRoleById);
router.post("/role/add", checkValid("Role"), roleController.create);
router.put("/role/edit/:id", checkValid("Role"), roleController.updateRole);

router.get("/role_permission/:id", roleController.role_permission);
router.post("/update_role_permission/:id", roleController.updateRolePermission);

router.get(
  "/settings-list/:type",
  generalSettingsController.listGeneralSetting
);
router.get("/settings/:type", generalSettingsController.getGeneralSetting);
router.put(
  "/update-settings",
  uploadSettings.fields([
    { name: "favicon", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "footer_logo", maxCount: 1 },
  ]),
  generalSettingsController.updateGeneralSetting
);

// router.delete('/toggle-status/:table/:id', generalSettingsController.toggleStatus);
// router.delete('/delete-record/:table/:id', generalSettingsController.commonDelete);
// router.post('/delete-multiple/:table', generalSettingsController.commonMultipleDelete);

router.all("/admin/*", function (req, res) {
  res.status(404).send({
    status: 404,
    message: "API not found",
    data: [],
  });
});

module.exports = router;
