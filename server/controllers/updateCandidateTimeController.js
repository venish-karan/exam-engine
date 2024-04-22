const database = require('../model/dbConnect');

const updateCandidateTime = (req, res) => {
    const {
        userName,
        candidateExamTime
    } = req.body;

    console.log("update time: ");
    console.log(req.body);

    const updateCandidateTimeQuery = "UPDATE candidate_details AS cd INNER JOIN users AS u ON cd.candidate_id = u.candidate_id SET cd.candidate_duration=? WHERE u.candidate_name=?";

    // const values = [
    //     candidateExamTime,
    //     userName
    // ];

    database.query(updateCandidateTimeQuery, [candidateExamTime, userName], (err, result) => {
        if(err) {
            console.error("Candidate Duration updating Query Error:", err);
            return res.status(500).json({error : "Candidate Duration updating Query Error"});
        }

        return res.status(200).json("updated candidate time successfully");
    });

}

module.exports = {
    updateCandidateTime,
}