const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const uiRoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    permission: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
uiRoleSchema.plugin(toJSON);
uiRoleSchema.plugin(paginate);

// static model methods here

// /**
//  * Check if email is taken
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
//  * @returns {Promise<boolean>}
//  */
// userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//   const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//   return !!user;
// };

// model methods here
// /**
//  * Check if password matches the user's password
//  * @param {string} password
//  * @returns {Promise<boolean>}
//  */
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

// model hook here (pre, post)

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef UiRole
 */
const UiRole = mongoose.model('UiRole', uiRoleSchema);

module.exports = UiRole;
