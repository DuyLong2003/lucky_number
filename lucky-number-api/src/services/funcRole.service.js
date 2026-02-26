const httpStatus = require('http-status');
const { FuncRole } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a funcRole
 * @param {Object} funcRoleBody
 * @returns {Promise<funcRole>}
 */
const createFuncRole = async (funcRoleBody) => {
  const funcRole = await FuncRole.create(funcRoleBody);
  return funcRole;
};

/**
 * Query for funcRoles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFuncRoles = async (filter, options) => {
  const funcRoles = await FuncRole.paginate(filter, options);
  return funcRoles;
};

/**
 * Get funcRole by id
 * @param {ObjectId} id
 * @returns {Promise<funcRole>}
 */
const getFuncRoleById = async (id) => FuncRole.findById(id);

/**
 * Update funcRole by id
 * @param {ObjectId} funcRoleId
 * @param {Object} updateBody
 * @returns {Promise<funcRole>}
 */
const updateFuncRoleById = async (funcRoleId, updateBody) => {
  const funcRole = await getFuncRoleById(funcRoleId);
  if (!funcRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'funcRole not found');
  }
  if (funcRole.name === 'super-admin' || funcRole.name === 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'super-admin or user funcRole cannot be update');
  }
  Object.assign(funcRole, updateBody);
  await funcRole.save();
  return funcRole;
};

/**
 * Delete funcRole by id
 * @param {ObjectId} funcRoleId
 * @returns {Promise<funcRole>}
 */
const deleteFuncRoleById = async (funcRoleId) => {
  const funcRole = await getFuncRoleById(funcRoleId);
  if (!funcRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'funcRole not found');
  }
  if (funcRole.name === 'super-admin' || funcRole.name === 'user') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'super-admin or user funcRole cannot be delete');
  }
  await FuncRole.deleteOne(funcRole._id);
  return funcRole;
};

module.exports = {
  createFuncRole,
  queryFuncRoles,
  getFuncRoleById,
  updateFuncRoleById,
  deleteFuncRoleById,
};
