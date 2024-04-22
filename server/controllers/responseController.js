const database = require('../model/dbConnect');

const handleResponse = (req, res) => {

    const {
        candidateId, 
        questionId,
        candidateSelectedOption,
        candidateSelectedAnswer
    } = req.body;

    console.log(req.body);

    const insertResponseQuery = "INSERT INTO responses (candidate_id,question_id,selected_option_id,selected_answer) VALUES (?)";

    const values = [
        candidateId, 
        questionId,
        candidateSelectedOption,
        candidateSelectedAnswer
    ];

    database.query(insertResponseQuery, [values], (err, result) => {
        if(err) {
            console.error("Response Query Error:", err);
            return res.status(500).json({error : "Response Query Error"});
        }

        res.status(200).json("response inserted successfully");
    });
}

module.exports = {
    handleResponse
}