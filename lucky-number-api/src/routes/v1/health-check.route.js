const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  res.send({ success: 'ok', message: 'system running' });
});

module.exports = router;
