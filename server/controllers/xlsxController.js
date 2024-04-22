const XLSX = require('xlsx');
const database = require('../model/dbConnect');

const handleQuestionBank = (req, res) => {
    // const {filePath} = req.body;

    const filePath = req.file.path;

    console.log(req.file);

    // const filePath = 'C:\\Users\\018030\\OneDrive - Sify Technologies Limited\\Desktop\\exam-engine\\server\\controllers\\file.xlsx';
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json(sheet);

    records.map(record => console.log(record));
    
    const questionUploadQuery = "INSERT INTO questions (`subject_name`,`subject_code`,`question_text`,`option_1`,`option_2`,`option_3`,`option_4`,`option_5`,`correct_option_id`, `correct_option`) VALUES ?";

    // let values = records.map(record => Object.values(record));

    let values = records.map(record => [
        record.subject_name,
        record.subject_code,
        record.question_text,
        record.option_1,
        record.option_2,
        record.option_3,
        record.option_4,
        record.option_5,
        record.correct_option_id,
        record.correct_option
    ]);

    database.query(questionUploadQuery, [values], (error, result) => {
        if(error) return res.status(500).json(`Query Error in uploading questions. ${error}`);

        res.status(200).json('Question Inserted Successfully');
    });
}

module.exports = {
    handleQuestionBank,
}