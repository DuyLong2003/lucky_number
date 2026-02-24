/* eslint-disable linebreak-style */
/* eslint-disable indent */
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/${req.baseUrl.replace('/v1/', '')}`);
  },
  filename: (req, file, cb) => {
    const fileType = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
    const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    const originalname = Buffer.from(fileName, 'latin1').toString('utf8');

    const fullName = `${new Date().getTime()}_${originalname}.${fileType}`;
    cb(null, fullName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});
module.exports = upload;
