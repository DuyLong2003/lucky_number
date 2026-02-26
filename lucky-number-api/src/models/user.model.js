const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate, findByIdAndPopulate } = require('./plugins');
const { GENDER, STATUS } = require('../config/constant');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    funcRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FuncRole',
    },
    uiRoleId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UiRole',
    }],
    address: { type: String },
    gender: { type: String, enum: GENDER },
    isPasswordChange: { type: Boolean, default: false },
    status: { type: String, enum: STATUS, default: STATUS.Active },
    validUntil: { type: Date },
    maxParticipants: { type: Number, default: 10 },
    notes: { type: String },
    customLogoUrl: { type: String, default: '' },
    brandColor: { type: String, default: '#EAB308' },
    isVip: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(findByIdAndPopulate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.methods.populateOption = async function (populate) {
  const userPopulate = await this.populate(populate);
  return userPopulate;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
