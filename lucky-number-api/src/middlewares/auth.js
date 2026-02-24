const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../config/constant');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = await user.populateOption('funcRoleId');
  if (req.user.status === STATUS.Delete || req.user.status === STATUS.Lock) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'User is lock or delete'));
  }
  if (requiredRights.length) {
    const userRights = req.user.funcRoleId.permission || [];
    // console.log(userRights);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== req.user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => new Promise((resolve, reject) => {
  passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
})
  .then(() => next())
  .catch((err) => next(err));

module.exports = auth;
