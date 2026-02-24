const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUiRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    permission: Joi.string().required()
  })
};

const getUiRoles = {
  query: Joi.object().keys({
    name: Joi.string(),
    permission: Joi.string(),
    limit: Joi.number().integer(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    select: Joi.string(),
    page: Joi.number().integer()
  })
};

const getUiRole = {
  params: Joi.object().keys({
    uiRoleId: Joi.string().custom(objectId)
  })
};

const updateUiRole = {
  params: Joi.object().keys({
    uiRoleId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      permission: Joi.string().required()
    })
    .min(1)
};

const deleteUiRole = {
  params: Joi.object().keys({
    uiRoleId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createUiRole,
  getUiRoles,
  getUiRole,
  updateUiRole,
  deleteUiRole
};
