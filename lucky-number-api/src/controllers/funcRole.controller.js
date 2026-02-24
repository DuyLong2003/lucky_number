const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { funcRoleService } = require('../services');
const { permission } = require('../config/permission');

const createFuncRole = catchAsync(async (req, res) => {
  const funcRole = await funcRoleService.createFuncRole(req.body);
  res.status(httpStatus.CREATED).send(funcRole);
});

const getFuncRoles = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'funcRole']);
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await funcRoleService.queryFuncRoles(filter, options);
  res.send(result);
});

const getFuncRole = catchAsync(async (req, res) => {
  const funcRole = await funcRoleService.getFuncRoleById(req.params.funcRoleId);
  if (!funcRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'funcRole not found');
  }
  res.send(funcRole);
});

const updateFuncRole = catchAsync(async (req, res) => {
  const funcRole = await funcRoleService.updateFuncRoleById(req.params.funcRoleId, req.body);
  res.send(funcRole);
});

const deleteFuncRole = catchAsync(async (req, res) => {
  await funcRoleService.deleteFuncRoleById(req.params.funcRoleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPermission = catchAsync(async (req, res) => {
  res.json(permission);
});

module.exports = {
  createFuncRole,
  getFuncRoles,
  getFuncRole,
  updateFuncRole,
  deleteFuncRole,
  getPermission,
};
