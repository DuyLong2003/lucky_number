const Joi = require('joi');
const { objectId } = require('./custom.validation');

const registerParticipant = {
  body: Joi.object().keys({
    fullName: Joi.string().required().trim(),
    phoneNumber: Joi.string()
      .required()
      .trim()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10-11 digits'
      }),
    org: Joi.string().required(),
    userId: Joi.string().custom(objectId).required()
  })
};

const getParticipants = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    isWinner: Joi.boolean(),
    limit: Joi.number().integer(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    select: Joi.string(),
    page: Joi.number().integer()
  })
};

const getParticipant = {
  params: Joi.object().keys({
    participantId: Joi.string().custom(objectId)
  })
};

const getParticipantByPhone = {
  params: Joi.object().keys({
    phoneNumber: Joi.string().required()
  })
};

const getDrawHistories = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    select: Joi.string(),
    page: Joi.number().integer()
  })
};

const getDrawHistory = {
  params: Joi.object().keys({
    historyId: Joi.string().custom(objectId)
  })
};

const getDrawHistoryByNumber = {
  params: Joi.object().keys({
    drawNumber: Joi.number().integer().required()
  })
};

module.exports = {
  registerParticipant,
  getParticipants,
  getParticipant,
  getParticipantByPhone,
  getDrawHistories,
  getDrawHistory,
  getDrawHistoryByNumber
};
