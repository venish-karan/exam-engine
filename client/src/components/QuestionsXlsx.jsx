import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const UploadFile = () => {

    const axiosPrivate = useAxiosPrivate();
    
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('xlsxfile', file);

        try {
            const response = await axiosPrivate.post('/xlsxQuestions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg('File uploaded successfully');
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <Container style={{width: "50%", marginTop: "50px"}}>
            {msg && <Alert>{msg}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Select XLSX File:</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                    <Form.Text>
                        Please Upload the file with .xlsx extension, and the header should contain this columns<br />
                        subject_name, subject_code, question_text, option_1, option_2, option_3, option_4, option_5, correct_option_id, correct_option
                    </Form.Text>
                </Form.Group>
                <Button type="submit">Upload</Button>
            </Form>
        </Container>
    );
};

export default UploadFile;