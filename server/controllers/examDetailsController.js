const database = require('../model/dbConnect');

const handleExamDetails = (req, res) => {

    const getExamDetailsQuery = "SELECT DATE_FORMAT(exam_date, '%Y-%m-%d') AS exam_date, exam_code, exam_name, subject_code, subject_name FROM exam_details";

    database.query(getExamDetailsQuery, [], (err, result) => {
        const examDetailsArray = result.map((row) => {
            return {
                examDate : row.exam_date,
                examCode : row.exam_code,
                examName : row.exam_name,
                subjectCode : row.subject_code,
                subjectName : row.subject_name
            }
        });

        // const examCodeRes = examDetailsArray.map(({ examCode, examName }) => ({ code: examCode, name: examName }));
        // const subjectCodeRes = examDetailsArray.map(({ subjectCode, subjectName }) => ({ code: subjectCode, name: subjectName }));

        res.status(200).json({examDetailsArray});
    });
}

module.exports = {
    handleExamDetails,
}