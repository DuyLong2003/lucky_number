/* eslint-disable import/no-extraneous-dependencies */
const moment = require('moment-timezone');

const momentTz = (date) => {
  if (date) return moment(date).tz('Asia/Ho_Chi_Minh');
  return moment().tz('Asia/Ho_Chi_Minh');
};

const momentTzUnix = (timestamp) => moment.unix(timestamp).tz('Asia/Ho_Chi_Minh');

module.exports = {
  momentTz,
  momentTzUnix
};
