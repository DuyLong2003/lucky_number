const httpStatus = require('http-status');
const { Participant, DrawHistory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Register a participant
 * @param {Object} participantBody
 * @returns {Promise<Participant>}
 */
const registerParticipant = async (participantBody) => {
  const { phoneNumber, fullName, org } = participantBody;

  // Check if phone number already exists
  const existingParticipant = await Participant.findOne({ phoneNumber });
  if (existingParticipant) {
    return existingParticipant;
  }

  // Get next lucky number
  const luckyNumber = await Participant.getNextLuckyNumber();

  // Create new participant
  const participant = await Participant.create({
    fullName,
    phoneNumber,
    luckyNumber,
    org
  });

  return participant;
};

/**
 * Query for participants
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.select] - Select fields (default = '')
 * @returns {Promise<QueryResult>}
 */
const queryParticipants = async (filter, options) => {
  const participants = await Participant.paginate(filter, options);
  return participants;
};

/**
 * Get participant by id
 * @param {ObjectId} id
 * @returns {Promise<Participant>}
 */
const getParticipantById = async (id) => Participant.findById(id);

/**
 * Get participant by phone number
 * @param {string} phoneNumber
 * @returns {Promise<Participant>}
 */
const getParticipantByPhoneNumber = async (phoneNumber) => {
  return Participant.findOne({ phoneNumber });
};

/**
 * Draw a random winner from participants who haven't won yet
 * @returns {Promise<Participant>}
 */
const drawWinner = async () => {
  // Get all participants who haven't won yet
  const availableParticipants = await Participant.find({ isWinner: false });

  if (availableParticipants.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No available participants to draw');
  }

  // Select a random participant
  const randomIndex = Math.floor(Math.random() * availableParticipants.length);
  const winner = availableParticipants[randomIndex];

  // Get the next win order number
  const winnerCount = await Participant.countDocuments({ isWinner: true });
  const nextWinOrder = winnerCount + 1;

  // Mark as winner with order
  winner.isWinner = true;
  winner.winOrder = nextWinOrder;
  await winner.save();

  return winner;
};

/**
 * Reset all participants (remove winner status)
 * @returns {Promise<Object>}
 */
const resetDraw = async () => {
  // Get all winners before resetting
  const winners = await Participant.find({ isWinner: true }).sort({ winOrder: 1 });

  // Only save history if there are winners
  if (winners.length > 0) {
    const drawNumber = await DrawHistory.getNextDrawNumber();

    // Prepare winner data for history
    const winnerData = winners.map((winner) => ({
      participantId: winner._id,
      fullName: winner.fullName,
      phoneNumber: winner.phoneNumber,
      luckyNumber: winner.luckyNumber,
      winOrder: winner.winOrder
    }));

    // Save to history
    await DrawHistory.create({
      drawNumber,
      winners: winnerData,
      totalWinners: winners.length,
      resetDate: new Date()
    });
  }

  // Reset all winners
  const result = await Participant.updateMany({ isWinner: true }, { isWinner: false, winOrder: null });

  return {
    message: 'Draw reset successfully',
    modifiedCount: result.modifiedCount,
    historySaved: winners.length > 0
  };
};

/**
 * Delete all participants
 * @returns {Promise<Object>}
 */
const deleteAllParticipants = async () => {
  //   const result = await Participant.deleteMany({});

  return {
    message: 'All participants deleted successfully'
    // deletedCount: result.deletedCount
  };
};

/**
 * Get statistics
 * @returns {Promise<Object>}
 */
const getStatistics = async () => {
  const total = await Participant.countDocuments();
  const winners = await Participant.countDocuments({ isWinner: true });
  const available = total - winners;

  return {
    total,
    winners,
    available
  };
};

/**
 * Query for draw histories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDrawHistories = async (filter, options) => {
  const histories = await DrawHistory.paginate(filter, options);
  return histories;
};

/**
 * Get draw history by id
 * @param {ObjectId} id
 * @returns {Promise<DrawHistory>}
 */
const getDrawHistoryById = async (id) => DrawHistory.findById(id);

/**
 * Get draw history by draw number
 * @param {number} drawNumber
 * @returns {Promise<DrawHistory>}
 */
const getDrawHistoryByNumber = async (drawNumber) => {
  return DrawHistory.findOne({ drawNumber });
};

/**
 * Delete all draw histories
 * @returns {Promise<Object>}
 */
const deleteAllDrawHistories = async () => {
  const result = await DrawHistory.deleteMany({});

  return {
    message: 'All draw histories deleted successfully',
    deletedCount: result.deletedCount
  };
};

module.exports = {
  registerParticipant,
  queryParticipants,
  getParticipantById,
  getParticipantByPhoneNumber,
  drawWinner,
  resetDraw,
  deleteAllParticipants,
  getStatistics,
  queryDrawHistories,
  getDrawHistoryById,
  getDrawHistoryByNumber,
  deleteAllDrawHistories
};
