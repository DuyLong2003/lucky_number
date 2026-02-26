const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { permission } = require('../../config/permission');

const router = express.Router();

// Tất cả route trong này đều bắt buộc quyền MANAGE_USER (Admin)
router.use(auth(permission.USER.MANAGE_USER));

router
    .route('/tenants')
    .get(validate(userValidation.getTenants), userController.getTenants);

router
    .route('/tenants/:tenantId')
    .patch(validate(userValidation.updateTenant), userController.updateTenantAdmin);

module.exports = router;
