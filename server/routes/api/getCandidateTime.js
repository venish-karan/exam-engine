const express = require('express');
const router = express.Router();
const getCandidateTimeController = require('../../controllers/getCandidateTimeController.js');

router.route('/')
.post(getCandidateTimeController.getCandidateTime);

module.exports = router;