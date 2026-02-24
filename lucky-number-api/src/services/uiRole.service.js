const httpStatus = require('http-status');
const { UiRole } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a uiRole
 * @param {Object} uiRoleBody
 * @returns {Promise<UiRole>}
 */
const createUiRole = async (uiRoleBody) => {
  const uiRole = await UiRole.create(uiRoleBody);
  return uiRole;
};

/**
 * Query for uiRoles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.select] - Select fiels (default = '')
 * @returns {Promise<QueryResult>}
 */
const queryUiRoles = async (filter, options) => {
  const uiRoles = await UiRole.paginate(filter, options);
  return uiRoles;
};

/**
 * Get uiRole by id
 * @param {ObjectId} id
 * @returns {Promise<UiRole>}
 */
const getUiRoleById = async (id) => UiRole.findById(id);

/**
 * Update uiRole by id
 * @param {ObjectId} uiRoleId
 * @param {Object} updateBody
 * @returns {Promise<UiRole>}
 */
const updateUiRoleById = async (uiRoleId, updateBody) => {
  const uiRole = await getUiRoleById(uiRoleId);
  if (!uiRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UiRole not found');
  }

  Object.assign(uiRole, updateBody);
  await uiRole.save();
  return uiRole;
};

/**
 * Delete uiRole by id
 * @param {ObjectId} uiRoleId
 * @returns {Promise<UiRole>}
 */
const deleteUiRoleById = async (uiRoleId) => {
  const uiRole = await getUiRoleById(uiRoleId);
  if (!uiRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UiRole not found');
  }
  await UiRole.deleteOne(uiRole._id);
  return uiRole;
};

module.exports = {
  createUiRole,
  queryUiRoles,
  getUiRoleById,
  updateUiRoleById,
  deleteUiRoleById
};
