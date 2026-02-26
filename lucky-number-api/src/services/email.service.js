const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = {
    from: config.email.from, to, subject, text,
  };
  await transport.sendMail(msg);
};

/**
 * Send an email
 * @param {string} to
 * @param {string} password
 * @returns {Promise}
 */
const sendPasswordEmailWhenCreate = async (to, user, password) => {
  const frontendUrl = config.url.includes('localhost') ? 'http://localhost:5173' : config.url;
  const subject = `Welcome to BFD Service`;
  const text = `Xin chào ${user.name}!,
Mật khẩu của tài khoản của bạn là ${password}, hãy thay đổi mật khẩu sau khi đăng nhập.
Để đăng nhập, hãy nhấp vào liên kết này: ${frontendUrl}/login`;
  await sendEmail(to, subject, text);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const frontendUrl = config.url.includes('localhost') ? 'http://localhost:5173' : config.url;
  const subject = 'Reset password';
  const resetPasswordUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
  const text = `Xin chào,
Để thay đổi mật khẩu, hãy nhấp vào liên kết này: ${resetPasswordUrl}
Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendPasswordEmailWhenCreate,
};
