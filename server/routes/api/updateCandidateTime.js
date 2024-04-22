const express = require('express');
const router = express.Router();
const updateCandidateTimeController = require('../../controllers/updateCandidateTimeController.js');

router.route('/')
.post(updateCandidateTimeController.updateCandidateTime);

module.exports = router;