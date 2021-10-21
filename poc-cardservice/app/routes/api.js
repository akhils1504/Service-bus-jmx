const express = require('express');
const router = express.Router();
const handler = require('../handlers/servicebus')

router.route('/gettoken/:cardnum')
    .get(handler.getToken);

module.exports = router;