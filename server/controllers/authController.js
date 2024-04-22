const database = require('../model/dbConnect.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/register.js');
require('dotenv').config();

const handleLogin = async (req,res) => {

    const { user, examCode, subjectCode, pwd, examDate, examAttended } = req.body;

    // console.log("examAttended", examAttended);
    
    if(!user || !pwd || !examCode || !subjectCode) {
        return res.status(400).json({'message': 'All details are required. '});
    }

    const loginQuery = "SELECT u.candidate_name, u.candidate_id, u.password_hash, u.role, u.exam_code, ed.exam_name, u.subject_code, ed.subject_name, u.exam_date FROM users AS u INNER JOIN exam_details AS ed ON u.exam_code = ed.exam_code AND u.subject_code = ed.subject_code WHERE u.candidate_name= ? AND u.exam_code= ? AND u.subject_code= ? AND u.exam_date = ?";

    const updateRefreshTokenQuery = "UPDATE users SET refresh_token=? WHERE candidate_name=?";

    const examAttendedQuery = "UPDATE candidate_details AS cd INNER JOIN users AS u ON cd.candidate_id = u.candidate_id SET cd.exam_attended = ? WHERE cd.exam_code = ? AND cd.subject_code = ? AND cd.exam_date = ? AND u.candidate_name = ?";

    // const rolesQuery = "SELECT user_roles.role_id FROM login JOIN user_roles_mapping ON login.id = user_roles_mapping.user_id JOIN user_roles ON user_roles_mapping.role_id = user_roles.role_id WHERE login.candidate_name = ?"; 

    // database.query(rolesQuery, [user], (err, roleData) => {

        // if(err) return res.sendStatus(500);

        // console.log(data[0].role_id);
        // const roles = roleData.map(row => row.role_id);

        database.query(loginQuery, [user, examCode, subjectCode, examDate], async (err,data) => {

            if(err) {
                return res.status(500).json('Failed to execute query');
            }
    
            if(data.length <= 0) {
                return res.sendStatus(401);
            }
            
            // evaluate password
            const match = await bcrypt.compare(pwd, data[0].password_hash);
            const userRoles = data[0].role;
            const roles = userRoles.split(',').map(role => parseInt(role));

            // Get current date
            const currentDate = new Date();

            // Extract year, month, and day
            const year = currentDate.getFullYear();
            // January is 0, so we add 1 to get the correct month
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            // Format the date in YYYY-MM-DD format
            const formattedDate = `${year}-${month}-${day}`;

            const examDateMatch = examDate === formattedDate;

            console.log("examDateMatch");
            console.log(examDateMatch);
            console.log(examDate, formattedDate);
    
            if(match && examDateMatch) {
                //create JWTs
                const accessToken = jwt.sign(
                    { 
                        "UserInfo": {
                            "username": data[0].candidate_name,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10800s' } // 3 hours
                );

                const refreshToken = jwt.sign(
                    { "username": data[0].candidate_name },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );

                const candidateId = data[0].candidate_id;
                const examCode = data[0].exam_code;
                const examName = data[0].exam_name;
                const subjectCode = data[0].subject_code;
                const subjectName = data[0].subject_name;
    
                database.query(updateRefreshTokenQuery, [refreshToken, data[0].candidate_name]);

                database.query(examAttendedQuery, [examAttended, examCode, subjectCode, examDate, user], (err, result) => {
                    if(err) return res.status(500).json('Database Attended Error');
                });
    
                res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); //option for https use this = secure: true,

                res.json({ 
                    accessToken, 
                    roles, 
                    candidateId, 
                    examCode,
                    examName, 
                    subjectCode,
                    subjectName 
                });

            } else {
                
                res.sendStatus(401);
            }
        });
    // });
};

module.exports = {
    handleLogin,
}