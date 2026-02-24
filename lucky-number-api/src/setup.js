const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const { permissionArr, USER_ROLE_ID } = require('./config/permission');
const { FuncRole, User } = require('./models');

const roleAdmin = {
  name: 'admin',
  permission: Object.values(permissionArr)
};
const roleUser = {
  _id: USER_ROLE_ID,
  name: 'user'
};

const user = {
  name: 'admin',
  gender: 'Nam',
  email: 'admin@admin.vn',
  password: '123456a@'
};
let server;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
  logger.info('Connected to MongoDB');
  try {
    const funcRoleAdmin = await FuncRole.create(roleAdmin);
    user.funcRoleId = await funcRoleAdmin.id;
    await FuncRole.create(roleUser);
  } catch (ex) {
    logger.error('cannot create Role ', ex);
  }
  try {
    await User.create(user);
  } catch (ex) {
    logger.error('cannot create user ', ex);
  }
  exitHandler();
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
