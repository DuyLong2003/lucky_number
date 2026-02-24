const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { uiRoleService } = require('../services');

const createUiRole = catchAsync(async (req, res) => {
  const uiRole = await uiRoleService.createUiRole(req.body);
  res.status(httpStatus.CREATED).send(uiRole);
});

const getUiRoles = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'select']);
  const result = await uiRoleService.queryUiRoles(filter, options);
  res.send(result);
});

const getUiRole = catchAsync(async (req, res) => {
  const uiRole = await uiRoleService.getUiRoleById(req.params.uiRoleId);
  if (!uiRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UiRole not found');
  }
  res.send(uiRole);
});

const updateUiRole = catchAsync(async (req, res) => {
  const uiRole = await uiRoleService.updateUiRoleById(req.params.uiRoleId, req.body);
  res.send(uiRole);
});

const deleteUiRole = catchAsync(async (req, res) => {
  await uiRoleService.deleteUiRoleById(req.params.uiRoleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUiRole,
  getUiRoles,
  getUiRole,
  updateUiRole,
  deleteUiRole
};
