// const questions = require('../model/questionsModel');
const database = require('../model/dbConnect');
const questions = require('../model/questionsModel');

const getAllQuestions = (req, res) => {

    const candidateName = req?.body?.candidateName;

    const questionQuery = "SELECT qp.subject_name, qp.subject_code, qp.question_text, qp.option_1, qp.option_2, qp.option_3, qp.option_4, qp.option_5, qp.correct_option FROM questions AS qp INNER JOIN users AS u ON qp.subject_code = u.subject_code WHERE u.candidate_name = ?";

    database.query(questionQuery, [candidateName], (err, result) => {
        if(err) return res.status(500).json('Question retrival error');

        const questions = [];
        
        questions.push(...result.map((item,index) => {
            return {
                id: index,
                text: item.question_text,
                options: [item.option_1, item.option_2, item.option_3, item.option_4, item.option_5],
                correctAnswer: item.correct_option
            }
        }));

        res.status(200).json(questions);
    });
    // res.json(questions);
};

module.exports = {
    getAllQuestions,
}