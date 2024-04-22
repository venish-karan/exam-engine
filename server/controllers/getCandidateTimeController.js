const database = require('../model/dbConnect');

const getCandidateTime = (req, res) => {
    const { userName } = req.body;

    console.log(req.body);

    const getCandidateTimeQuery = "SELECT cd.candidate_duration FROM candidate_details AS cd INNER JOIN users AS u ON cd.candidate_id = u.candidate_id WHERE u.candidate_name = ?";

    const values = [userName];

    database.query(getCandidateTimeQuery, [values], (err, result) => {
        if(err) {
            console.error("Candidate Duration Query Error:", err);
            return res.status(500).json({error : "Candidate Duration Query Error"});
        }
        console.log(result);
        return res.status(200).json(result[0].candidate_duration);
    })
}

module.exports = {
    getCandidateTime,
}