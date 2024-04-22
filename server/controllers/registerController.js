const salt = 10;
const bcrypt = require('bcrypt');
const database = require('../model/dbConnect');

const handleNewUser = (req, res) => {
    const userExistsQry = "SELECT COUNT(1) FROM users WHERE candidate_name = ?";

    const userCountQry = "SELECT COUNT(1) FROM users";

    const registerQuery = "INSERT INTO users (`candidate_name`, `candidate_id`, `password_hash`, `exam_code`, `subject_code`, `exam_date`) VALUES (?)";

    const examDetails = "SELECT exam_duration_mins FROM exam_details WHERE exam_code = ? AND subject_code = ? AND exam_date = ?";

    const insertCandidateDetails = "INSERT INTO candidate_details (`candidate_id`, `exam_code`, `subject_code`, `exam_date`, `candidate_duration`) VALUES (?)";

    // const userRolesQuery = "INSERT INTO user_roles_mapping (`user_id`, `role_id`) VALUES ((SELECT id FROM login WHERE candidate_name= ?),(SELECT role_id FROM user_roles WHERE role_name= ?))";

    // const candidateSubjectQuery = "INSERT INTO candidate_subject (`candidate_id`, `subject_code`, `subject_name`) VALUES(?)";

    // Check if the username already exists
    database.query(userExistsQry, [req.body.user], (err, existsResult) => {
        if (err) {
            return res.status(500).send({ error: "Query Error" });
        }

        if (existsResult[0]['COUNT(1)'] > 0) {
            return res.status(409).send({ error: "User Already Taken" });
        }

        // Get the user count
        database.query(userCountQry, (err, countResult) => {
            if (err) {
                return res.status(500).send({ error: "Count Error" });
            }

            const userCount = countResult[0]['COUNT(1)'] + 1;

            // Hash the password
            bcrypt.hash(req.body.pwd.toString(), salt, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: "Error for hashing password" });
                }

                // Insert the user into the database
                const values = [req?.body?.user, userCount, hash, req?.body?.examCode, req?.body?.subjectCode, req?.body?.examDate];

                database.query(registerQuery, [values], (err, insertResult) => {
                    if (err) {
                        return res.status(500).json({ error: "Inserting data Error in server" });
                    }

                    database.query(examDetails, [req?.body?.examCode, req?.body?.subjectCode, req?.body?.examDate], (err, examDuration) => {
                        if(err) return res.status(500).json({error: "Getting details error in server"});

                        const candidateDetailsValues = [
                            userCount, 
                            req?.body?.examCode, 
                            req?.body?.subjectCode, 
                            req?.body?.examDate, 
                            examDuration[0].exam_duration_mins
                        ];

                        database.query(insertCandidateDetails, [candidateDetailsValues], (err, insertDetailsResult) => {
                            // console.log(err);
                            if(err) return res.status(500).json({error: "Inserting details error in server"});
                            return res.sendStatus(204); // successful, with no content
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    handleNewUser,
}