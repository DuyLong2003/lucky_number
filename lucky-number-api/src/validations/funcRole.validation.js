const Joi = require('joi');
const { permissionArr } = require('../config/permission');
const { objectId } = require('./custom.validation');

const createFuncRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    permission: Joi.array().items(Joi.string().valid(...permissionArr)),
  }),
};

const getFuncRoles = {
  query: Joi.object().keys({
    name: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFuncRole = {
  params: Joi.object().keys({
    funcRoleId: Joi.string().custom(objectId),
  }),
};

const updateFuncRole = {
  params: Joi.object().keys({
    funcRoleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      permission: Joi.array()
        .items(Joi.string().valid(...permissionArr))
        .required(),
    })
    .min(1),
};

const deleteFuncRole = {
  params: Joi.object().keys({
    funcRoleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createFuncRole,
  getFuncRoles,
  getFuncRole,
  updateFuncRole,
  deleteFuncRole,
};
