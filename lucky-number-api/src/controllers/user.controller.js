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
  req.body.funcRoleId = USER_ROLE_ID;
  const user = await userService.createUser(req.body);

  // Gửi email bất đồng bộ
  Promise.resolve().then(async () => {
    try {
      await emailService.sendPasswordEmailWhenCreate(user.email, user, req.body.password);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  });

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

const getPublicConfig = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user || !user.status || user.status.toLowerCase() !== 'active') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tài khoản');
  }

  res.send({
    name: user.name,
    customLogoUrl: user.isVip ? user.customLogoUrl : '',
    brandColor: user.isVip ? user.brandColor : '#EAB308',
    isVip: user.isVip || false
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { email, funcRoleId } = req.body;
  if (email || funcRoleId) {
    const userPermission = req.user.funcRoleId.permission || [];
    if (!userPermission.includes(permission.USER.MANAGE_USER)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }

  const currentUser = await userService.getUserById(req.params.userId);
  if (!currentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Chặn không cho Tenant chưa phải VIP đổi Theme
  const { brandColor, customLogoUrl } = req.body;
  if ((brandColor || customLogoUrl) && !currentUser.isVip) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Tính năng tuỳ chỉnh thương hiệu (White-label) chỉ dành cho khách hàng VIP.');
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

const getTenants = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = options.sortBy || 'createdAt:desc';

  // Lọc lấy các user có funcRoleId = USER_ROLE_ID (nghĩa là Tenant)
  const filter = { funcRoleId: USER_ROLE_ID };
  const result = await userService.queryUsers(filter, options);

  // Transform data để trả về gọn gàng cho Frontend Dashboard
  result.results = result.results.map(user => {
    const userJson = typeof user.toJSON === 'function' ? user.toJSON() : user;
    return pick(userJson, ['_id', 'id', 'name', 'email', 'maxParticipants', 'validUntil', 'notes', 'status', 'createdAt', 'isVip']);
  });

  res.send(result);
});

const updateTenantAdmin = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.tenantId, req.body);
  const userJson = typeof user.toJSON === 'function' ? user.toJSON() : user;
  res.send(pick(userJson, ['_id', 'id', 'name', 'email', 'maxParticipants', 'validUntil', 'notes', 'status', 'createdAt', 'isVip']));
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  setPassword,
  regUser,
  getPublicConfig,
  getTenants,
  updateTenantAdmin
};
