const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const drawHistorySchema = mongoose.Schema(
  {
    drawNumber: {
      type: Number,
      required: true,
      unique: true
    },
    winners: [
      {
        participantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Participant',
          required: true
        },
        fullName: {
          type: String,
          required: true
        },
        phoneNumber: {
          type: String,
          required: true
        },
        luckyNumber: {
          type: Number,
          required: true
        },
        winOrder: {
          type: Number,
          required: true
        }
      }
    ],
    totalWinners: {
      type: Number,
      required: true
    },
    resetDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
drawHistorySchema.plugin(toJSON);
drawHistorySchema.plugin(paginate);

/**
 * Get the next draw number
 * @returns {Promise<number>}
 */
drawHistorySchema.statics.getNextDrawNumber = async function () {
  const lastDraw = await this.findOne().sort({ drawNumber: -1 });
  return lastDraw ? lastDraw.drawNumber + 1 : 1;
};

/**
 * @typedef DrawHistory
 */
const DrawHistory = mongoose.model('DrawHistory', drawHistorySchema);

module.exports = DrawHistory;
