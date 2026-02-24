const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { permisionArr } = require('../config/permission');

const funcRoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    permission: {
      type: [String],
      enum: permisionArr,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
funcRoleSchema.plugin(toJSON);
funcRoleSchema.plugin(paginate);

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

funcRoleSchema.pre(['save', 'create'], async function (next) {
  const funcRole = this;
  const funcRolePermission = funcRole.permission;
  funcRole.permission = funcRolePermission.filter((v, i, self) => self.indexOf(v) === i);
  next();
});

/**
 * @typedef funcRole
 */
const funcRole = mongoose.model('FuncRole', funcRoleSchema);

module.exports = funcRole;
