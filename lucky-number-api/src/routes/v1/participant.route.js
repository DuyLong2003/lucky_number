const express = require('express');
const validate = require('../../middlewares/validate');
const participantValidation = require('../../validations/participant.validation');
const participantController = require('../../controllers/participant.controller');
const auth = require('../../middlewares/auth');
const { checkTenantQuota } = require('../../middlewares/tenant');

const router = express.Router();

// Register participant (create new or return existing)
router.route('/register').post(validate(participantValidation.registerParticipant), checkTenantQuota, participantController.registerParticipant);

// Get all participants
router.route('/').get(auth(), checkTenantQuota, validate(participantValidation.getParticipants), participantController.getParticipants);

// Get participant by ID
router.route('/:participantId').get(checkTenantQuota, validate(participantValidation.getParticipant), participantController.getParticipant);

// Get participant by phone number
router.route('/phone/:phoneNumber').get(checkTenantQuota, validate(participantValidation.getParticipantByPhone), participantController.getParticipantByPhone);

// Draw winner
router.route('/draw/winner').post(auth(), checkTenantQuota, participantController.drawWinner);

// Reset draw (reset all isWinner flags)
router.route('/draw/reset').post(auth(), checkTenantQuota, participantController.resetDraw);

// Delete all participants
router.route('/delete/all').delete(auth(), checkTenantQuota, participantController.deleteAllParticipants);

// Get statistics
router.route('/stats/summary').get(checkTenantQuota, participantController.getStatistics);

// Get draw histories
router.route('/history/all').get(auth(), checkTenantQuota, validate(participantValidation.getDrawHistories), participantController.getDrawHistories);

// Get draw history by ID
router.route('/history/:historyId').get(auth(), checkTenantQuota, validate(participantValidation.getDrawHistory), participantController.getDrawHistory);

// Get draw history by draw number
router
  .route('/history/draw/:drawNumber')
  .get(auth(), checkTenantQuota, validate(participantValidation.getDrawHistoryByNumber), participantController.getDrawHistoryByNumber);

// Delete all draw histories
router.route('/history/delete/all').delete(auth(), checkTenantQuota, participantController.deleteAllDrawHistories);

module.exports = router;
