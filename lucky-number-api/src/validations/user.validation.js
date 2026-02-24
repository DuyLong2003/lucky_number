const Joi = require('joi');
const { GENDER, STATUS } = require('../config/constant');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    // password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    funcRoleId: Joi.string().required().custom(objectId),
    uiRoleId: Joi.string().required().custom(objectId),
    address: Joi.string(),
    gender: Joi.string()
      .valid(...Object.values(GENDER))
      .required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string().valid(...Object.values(STATUS)),
    funcRoleId: Joi.string().custom(objectId),
    uiRoleId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    populate: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      funcRoleId: Joi.string().custom(objectId),
      uiRoleId: Joi.string().custom(objectId),
      address: Joi.string(),
      gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required(),
      status: Joi.string().valid(...Object.values(STATUS)),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const changePassword = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      oldPassword: Joi.string().custom(password).required(),
      newPassword: Joi.string().custom(password).required(),
    })
    .min(1),
};

const setPassword = {
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId).required(),
      password: Joi.string().custom(password).required(),
    })
    .min(1),
};

const regUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    // password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  setPassword,
  regUser,
};
