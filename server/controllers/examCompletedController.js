const database = require('../model/dbConnect');

const handleExamCompleted = (req, res) => {

    const {
        examCompleted,
        candidateName,
        candidateId
    } = req.body;

    const examCompletedQuery = "UPDATE candidate_details SET exam_completed = ? WHERE candidate_id = ?";

    database.query(examCompletedQuery, [examCompleted, candidateId], (err, result) => {
        if(err) return res.send(500).json('Update Exam Completed Database Error');

        return res.status(200).json('updated successfully');
    });
}

module.exports = {
    handleExamCompleted,
}