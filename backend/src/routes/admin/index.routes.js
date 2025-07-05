const router = require('express').Router()
const { showValidationErrors, authCheckAdmin } = require('../../middelwares');
const checkValid = require('../../middelwares/validator');
const Constants = require('../../helpers/constant');
const Storage = require('../../helpers/Storage');

const adminController = require('../../controllers/adminController');


// Authentication
router.post('/login', adminController.login);
// router.post('/login-with-phone', adminController.adminPhoneLogin);


// Protected Routes ..........................
router.use(authCheckAdmin);

// router.delete('/toggle-status/:table/:id', generalSettingsController.toggleStatus);
// router.delete('/delete-record/:table/:id', generalSettingsController.commonDelete);
// router.post('/delete-multiple/:table', generalSettingsController.commonMultipleDelete);

router.all('/admin/*', function (req, res) {
  res.status(404).send({
    status: 404,
    message: 'API not found',
    data: [],
  });
});

module.exports = router;