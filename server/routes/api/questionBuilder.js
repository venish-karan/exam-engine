const express = require('express');
const router = express.Router();
const questionBuilderController = require('../../controllers/questionBuilderController.js');
// const verifyJWT = require('../../middleware/verifyJwt.js');
// const ROLES_LIST = require('../../config/rolesList.js');
// const verifyRoles = require('../../middleware/verifyRoles.js');

router.route('/')
 .post(questionBuilderController.updateQuestion);

module.exports = router;