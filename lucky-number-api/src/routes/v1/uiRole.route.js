const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const uiRoleValidation = require('../../validations/uiRole.validation');
const uiRoleController = require('../../controllers/uiRole.controller');
const { permission } = require('../../config/permission');

const router = express.Router();

router
  .route('/')
  .post(auth(permission.UIROLE.MANAGE_UIROLE), validate(uiRoleValidation.createUiRole), uiRoleController.createUiRole)
  .get(auth(permission.UIROLE.GET_UIROLE), validate(uiRoleValidation.getUiRoles), uiRoleController.getUiRoles);

router
  .route('/:uiRoleId')
  .get(auth(permission.UIROLE.GET_UIROLE), validate(uiRoleValidation.getUiRole), uiRoleController.getUiRole)
  .patch(auth(permission.UIROLE.MANAGE_UIROLE), validate(uiRoleValidation.updateUiRole), uiRoleController.updateUiRole)
  .delete(auth(permission.UIROLE.DELETE_UIROLE), validate(uiRoleValidation.deleteUiRole), uiRoleController.deleteUiRole);

module.exports = router;
