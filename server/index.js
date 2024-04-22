const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const ROLES_LIST = require('./config/rolesList.js');

const verifyRoles = require('./middleware/verifyRoles.js');
const verifyJwt = require('./middleware/verifyJwt.js');

const app = express();
const port = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
//middleware for cookies
app.use(cookieParser());

//public routes
app.use('/register', require('./routes/register'));
app.use('/examdetails', require('./routes/api/examDetailsRouter'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//user role based entry. eg: user logined in with admin, candidate, editor can only enter this route
app.use(verifyJwt);
app.use(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Candidate, ROLES_LIST.Editor));

app.use('/questions', require('./routes/api/questions.js'));
app.use('/getCandidateTime', require('./routes/api/getCandidateTime.js'));
app.use('/updateCandidateTime', require('./routes/api/updateCandidateTime.js'));
app.use('/response', require('./routes/api/response'));
app.use('/examCompleted', require('./routes/api/examCompletedRouter'));

// app.use(verifyRoles(ROLES_LIST.Admin));
app.use('/questionBuilder', require('./routes/api/questionBuilder'));
app.use('/xlsxQuestions', require('./routes/api/xlsxRouter'));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
