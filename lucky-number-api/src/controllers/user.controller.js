const httpStatus = require('http-status');
const generator = require('generate-password');
const pick = require('../utils/pick');
const pickSearch = require('../utils/pickSearch');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, emailService } = require('../services');
const { permission, USER_ROLE_ID } = require('../config/permission');

const createUser = catchAsync(async (req, res) => {
  req.body.password = generator.generate({
    length: 8,
    numbers: true,
    strict: true
  });
  const user = await userService.createUser(req.body);
  await emailService.sendPasswordEmailWhenCreate(user.email, user, req.body.password);
  res.status(httpStatus.CREATED).send(user);
});

const regUser = catchAsync(async (req, res) => {
  req.body.password = generator.generate({
    length: 8,
    numbers: true,
    strict: true
  });
  req.body.funcRoleId = USER_ROLE_ID;
  const user = await userService.createUser(req.body);
  await emailService.sendPasswordEmailWhenCreate(user.email, user, req.body.password);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['status', 'funcRoleId', 'uiRoleId']);
  filter = { ...filter, ...pickSearch(req.query, ['name']) };
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId, req.query.populate);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { email, funcRoleId } = req.body;
  if (email || funcRoleId) {
    const userPermission = req.user.funcRoleId.permission || [];
    if (!userPermission.includes(permission.USER.MANAGE_USER)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.userId ?? req.user.id;
  if (!(await req.user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'old password is not match');
  }
  const user = await userService.updateUserById(userId, { password: newPassword });
  user.isPasswordChange = true;
  await user.save();
  res.send(user);
});

const setPassword = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.body.userId, { password: req.body.password });
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  setPassword,
  regUser
};
