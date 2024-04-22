const express = require('express');
const router = express.Router();
const responseController = require('../../controllers/responseController.js');

router.route('/')
.post(responseController.handleResponse);

module.exports = router;