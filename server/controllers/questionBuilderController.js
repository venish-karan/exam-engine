const database = require('../model/dbConnect.js');

const updateQuestion = (req, res) => {
    const {
        subjectName,
        subjectCode,
        questionText,
        option1,
        option2,
        option3,
        option4,
        option5,
        correctOptionId,
        correctOption
    } = req.body;

    console.log(req.body);
    
    const questionUploadQuery = "INSERT INTO questions (`subject_name`,`subject_code`,`question_text`,`option_1`,`option_2`,`option_3`,`option_4`,`option_5`,`correct_option_id`, `correct_option`) VALUES (?)";

    const values = [
        subjectName,
        subjectCode,
        questionText,
        option1,
        option2,
        option3,
        option4,
        option5,
        correctOptionId,
        correctOption
    ];

    database.query(questionUploadQuery, [values], (error, result) => {
        if(error) return res.status(500).json('Query Error in uploading questions.');

        res.status(200).json('Question Inserted Successfully');
    })
}

module.exports = {
    updateQuestion,
}