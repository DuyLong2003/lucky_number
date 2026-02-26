const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { required } = require('yargs');

const participantSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    org: {
      type: String
    },
    luckyNumber: {
      type: Number,
      required: true
    },
    isWinner: {
      type: Boolean,
      default: false
    },
    winOrder: {
      type: Number,
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

participantSchema.index({ phoneNumber: 1, userId: 1 }, { unique: true });
participantSchema.index({ luckyNumber: 1, userId: 1 }, { unique: true });

// add plugin that converts mongoose to json
participantSchema.plugin(toJSON);
participantSchema.plugin(paginate);

/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The participant's phone number
 * @returns {Promise<boolean>}
 */
participantSchema.statics.isPhoneNumberTaken = async function (phoneNumber, userId) {
  const participant = await this.findOne({ phoneNumber, userId });
  return !!participant;
};

/**
 * Get the next lucky number
 * @returns {Promise<number>}
 */
participantSchema.statics.getNextLuckyNumber = async function (userId) {
  const lastParticipant = await this.findOne({ userId }).sort({ luckyNumber: -1 });
  return lastParticipant ? lastParticipant.luckyNumber + 1 : 1;
};

/**
 * @typedef Participant
 */
const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
