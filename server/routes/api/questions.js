const express = require('express');
const router = express.Router();
const questionsController = require('../../controllers/questionsController.js');
// const verifyJWT = require('../../middleware/verifyJwt.js');
const ROLES_LIST = require('../../config/rolesList.js');
const verifyRoles = require('../../middleware/verifyRoles.js');

router.route('/')
 .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Candidate, ROLES_LIST.Editor), questionsController.getAllQuestions);
//  .get(verifyJWT, questionsController.getAllQuestions);

module.exports = router;