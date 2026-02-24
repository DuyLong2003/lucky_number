const httpStatus = require('http-status');
const pick = require('../utils/pick');
const pickSearch = require('../utils/pickSearch');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { participantService } = require('../services');

const registerParticipant = catchAsync(async (req, res) => {
  const participant = await participantService.registerParticipant(req.body);
  res.status(httpStatus.CREATED).send(participant);
});

const getParticipants = catchAsync(async (req, res) => {
  const filter = { ...pick(req.query, ['isWinner']), ...pickSearch(req.query, ['fullName', 'phoneNumber']) };
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'select']);
  const result = await participantService.queryParticipants(filter, options);
  res.send(result);
});

const getParticipant = catchAsync(async (req, res) => {
  const participant = await participantService.getParticipantById(req.params.participantId);
  if (!participant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Participant not found');
  }
  res.send(participant);
});

const getParticipantByPhone = catchAsync(async (req, res) => {
  const participant = await participantService.getParticipantByPhoneNumber(req.params.phoneNumber);
  if (!participant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Participant not found');
  }
  res.send(participant);
});

const drawWinner = catchAsync(async (req, res) => {
  const winner = await participantService.drawWinner();
  res.send(winner);
});

const resetDraw = catchAsync(async (req, res) => {
  const result = await participantService.resetDraw();
  res.send(result);
});

const deleteAllParticipants = catchAsync(async (req, res) => {
  const result = await participantService.deleteAllParticipants();
  res.send(result);
});

const getStatistics = catchAsync(async (req, res) => {
  const stats = await participantService.getStatistics();
  res.send(stats);
});

const getDrawHistories = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'select']);
  const result = await participantService.queryDrawHistories(filter, options);
  res.send(result);
});

const getDrawHistory = catchAsync(async (req, res) => {
  const history = await participantService.getDrawHistoryById(req.params.historyId);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Draw history not found');
  }
  res.send(history);
});

const getDrawHistoryByNumber = catchAsync(async (req, res) => {
  const history = await participantService.getDrawHistoryByNumber(req.params.drawNumber);
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Draw history not found');
  }
  res.send(history);
});

const deleteAllDrawHistories = catchAsync(async (req, res) => {
  const result = await participantService.deleteAllDrawHistories();
  res.send(result);
});

module.exports = {
  registerParticipant,
  getParticipants,
  getParticipant,
  getParticipantByPhone,
  drawWinner,
  resetDraw,
  deleteAllParticipants,
  getStatistics,
  getDrawHistories,
  getDrawHistory,
  getDrawHistoryByNumber,
  deleteAllDrawHistories
};
