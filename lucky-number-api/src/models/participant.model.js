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
      unique: true,
      trim: true
    },
    org: {
      type: String
    },
    luckyNumber: {
      type: Number,
      required: true,
      unique: true
    },
    isWinner: {
      type: Boolean,
      default: false
    },
    winOrder: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
participantSchema.plugin(toJSON);
participantSchema.plugin(paginate);

/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The participant's phone number
 * @returns {Promise<boolean>}
 */
participantSchema.statics.isPhoneNumberTaken = async function (phoneNumber) {
  const participant = await this.findOne({ phoneNumber });
  return !!participant;
};

/**
 * Get the next lucky number
 * @returns {Promise<number>}
 */
participantSchema.statics.getNextLuckyNumber = async function () {
  const lastParticipant = await this.findOne().sort({ luckyNumber: -1 });
  return lastParticipant ? lastParticipant.luckyNumber + 1 : 1;
};

/**
 * @typedef Participant
 */
const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
