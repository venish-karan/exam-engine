import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
// import DisplayTime from './DisplayTime';
import ExamCompleted from "./ExamCompleted";
import useAuth from '../hooks/useAuth';
import useCountDown from "../hooks/useCountDown";
import useDbTime from "../hooks/useDbTime";

import { Row, Col, Container, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import userLogin2 from './userLogin2.png';

import "./DisplayQuestion.css";

const QUESTIONS_URL = 'questions';
const RESPONSE_URL = 'response';
const EXAM_COMPLETED = 'examCompleted';

const DisplayQuestion = () => {

    // const dispatch = useDispatch();
    const { auth } = useAuth();
    const candidateName = auth.user;
    const candidateId = auth.candidateId;
    const subjectName = auth.subjectNameRes;
    const { getTime, updateTime } = useDbTime();
    const { timeLeft, start } = useCountDown();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    // const candidateTime = useSelector((state) => state.candidateTime.value);

    // const [updateTimeValue, setUpdateTimeValue] = useState(null);

    // console.log("updateTimeValue " + updateTimeValue);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // here question number starts with 0 so add 1 to it
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});

    console.log("selectedOption");
    console.log(selectedOption);

    const currentQuestion = questions[currentQuestionIndex];
    const currentSelectedOption = selectedOption[currentQuestionIndex];

    const [cellClasses, setCellClasses] = useState({});

    const rows = [];
    if(questions) {
        const numRows = Math.ceil(questions.length / 10);

        // Generate table rows and columns
        // const rows = [];
        for (let i = 0; i < numRows; i++) {
            const rowCells = [];
            for (let j = 0; j < 10; j++) {
                const questionNumber = i * 10 + j + 1;
                if (questionNumber <= questions.length) {
                    const className = cellClasses[questionNumber] || '';
                    rowCells.push(
                    // <td key={questionNumber} className={`td-${questionNumber}`}>{questionNumber}</td>
                    <td key={questionNumber} className={`${className}`}>
                        {questionNumber}
                    </td>
                    );
                } 
                // else {
                //     rowCells.push(
                //     <td key={`empty-${j}`}></td>
                //     );
                // }
            }
            rows.push(
            <tr key={i}>{rowCells}</tr>
            );
        }
    }

    

    // fetcing questions
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getQuestions = async () => {

            try {

                const response = await axiosPrivate.post(QUESTIONS_URL, JSON.stringify({candidateName}) ,{
                    signal: controller.signal
                });
                isMounted && setQuestions(response.data);
                console.log("responsedata");
                console.log(response.data.length);
                if(response.data.length == 0) {
                    setLoading(false);
                }

            } catch(err) {

                console.log(err);
                navigate('/login', { state: {from:location}, replace: true });
            }
        }
        getQuestions();

        // start timer once question is retrieved
        const fetchData = async () => {
            try {
                const timeData = await getTime();
                console.log("Time data: ", timeData);
                start(timeData);
                // setUpdateTimeValue(timeData);
            } catch (error) {
                console.error("Error fetching time: ", error);
            }
        }
        fetchData();

        return () => {
            isMounted = false;
            controller.abort();
            // clearInterval(timeOutUpdateTime);
        }
    }, []);

    // useEffect(() => {
    //     const postTimeData = async (updateTimeValue) => {
    //         try {
    //             const timeUpdateData = await updateTime(updateTimeValue);
    //             console.log("Time update posting data: ", timeUpdateData);
    //         } catch (error) {
    //             console.error("Error posting time: ", error);
    //         }
    //     }
    //     postTimeData(updateTimeValue);

    //     const timeIntervalUpdateTime = setInterval(() => {
    //         setUpdateTimeValue((prevTime) => {
    //             if(prevTime < 0) return 0;
                
    //             return prevTime - 50;
    //         });
    //         // setUpdateTimeValue(timeLeft);
    //     }, 60000);

    //     return () => clearInterval(timeIntervalUpdateTime);
    // }, [updateTimeValue]);

    useEffect(() => {
        let isMounted = true;
        if(timeLeft === 0) {
            
            ;(async () => {
                const examCompleted = 'auto_submitted';
                const examCompletedRequest = await axiosPrivate.post(EXAM_COMPLETED, JSON.stringify({ examCompleted, candidateName, candidateId }))
            })()
        }

        if(timeLeft >= 0 && timeLeft % 60 === 0) {
            const postTimeData = async (updateTimeValue) => {
                try {
                    const timeUpdateData = await updateTime(updateTimeValue);
                    console.log("Time update posting data: ", timeUpdateData);
                } catch (error) {
                    console.error("Error posting time: ", error);
                }
            }
            postTimeData(timeLeft);
        }

        return () => {
            isMounted = false;
        }
    }, [timeLeft]);

    // updating responses of each candidate
    useEffect(() => {
        const controller = new AbortController();

        const updateResponse = () => {
            
            const candidateId = auth.candidateId;
            const questionId = currentQuestionIndex;
            const currentQuestionRequest = questions[currentQuestionIndex];
            const candidateSelectedAnswer = (selectedOption[currentQuestionIndex] === undefined) ? '' : selectedOption[currentQuestionIndex];
    
            if(currentQuestionRequest) {
    
                const candidateSelectedOption = (currentQuestionRequest.options.indexOf(selectedOption[currentQuestionIndex])) + 1;
    
                try {
                    const request = axiosPrivate.post(RESPONSE_URL, JSON.stringify({
                        candidateId,
                        questionId,
                        candidateSelectedOption,
                        candidateSelectedAnswer
                    }, {
                        signal : controller.signal
                    }));
                } catch (err) {
                    console.log(err.request.data);
                }
            }
        }
        updateResponse();

        // Function to update the class names based on selectedOption
        const updateTableColor = () => {
        const updatedClasses = {};
            for (const key in selectedOption) {
                if (selectedOption.hasOwnProperty(key)) {
                    const questionNumber = parseInt(key) + 1;
                    const className = selectedOption[key] ? 'attended' : 'notAttended';
                    updatedClasses[questionNumber] = className;
                }
            }
            setCellClasses(updatedClasses);
        };

        updateTableColor();

        return () => {
            controller.abort();
        }

    }, [selectedOption]);

    // updating the response of each candidate with current choosed option
    const handleOptionChange = (option) => {
        setSelectedOption((previousState) => {
            return {...previousState, [currentQuestionIndex]: option
            };
        });
    }

    // clearing the option
    const handleClearOption = () => {
        setSelectedOption((previousState) => {
            return {...previousState, [currentQuestionIndex]: ""};
        });
    }

    //  Going to previous question
    const handlePreviousQuestion = () => {
        if(currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    // Going to next question
    const handleNextQuestion = () => {
        if(currentQuestionIndex < questions.length-1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    // exiting from the exam
    const handleSubmit = async () => {
        const controller = new AbortController();
        try {
            const examCompleted = 'manual_submitted';
            const response = await axiosPrivate.post(EXAM_COMPLETED, JSON.stringify({ examCompleted, candidateName, candidateId }), {
                signal: controller.signal
            });

            // Check if response status is successful
            if (response.status === 200) {
                // Navigation after successful submission
                navigate("/examCompleted");
            } else {
                console.error("Unexpected status code:", response.status);
                // Handle unexpected status code
            }
            navigate("/examCompleted");
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                console.error("Error:", error);
                // Handle other errors
            }
        } finally {
            // Cleanup: Abort the request if it's still ongoing
            controller.abort();
        }
    }

    console.log("loading")
    console.log(loading)

    // rendering loading if questions are not fetched from api
    if(!loading) {
        return (<h3>Loading...</h3>);
    }

    return (
            <>
            <br />
            {(loading && timeLeft !== null) ? (
                (timeLeft > 0) ? (
                    <>
                    <Row className="custom-row-height">
                        <Col md={8}>
                            <Card className="custom-card-height" style={{ overflow: 'auto' }} >
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Alert style={{backgroundColor: "lightgray", color: "white", border: "2px solid black"}}>Subject Name : <b>{subjectName}</b></Alert>
                                    </div>
                                    <div className="question-body">
                                        {currentQuestion && (
                                        <div className="question-container">
                                            <p>{parseInt(currentQuestion.id) + 1}.&nbsp;&nbsp;{currentQuestion.text}</p>
                                            <ul className="questionListStyle">
                                                {currentQuestion.options.map((option,index) => 
                                                    (option !== '') ? (
                                                        <li key={index}>
                                                            <input
                                                                type="radio"
                                                                id={`option_${index}`}
                                                                name="options"
                                                                value={option}
                                                                checked={currentSelectedOption === option}
                                                                onChange={() => handleOptionChange(option)}
                                                            />
                                                            &nbsp;
                                                            <label htmlFor={`option_${index}`}>{option}</label>
                                                        </li>
                                                    ) : null
                                                )}
                                            </ul>    
                                        </div>
                                        )}  
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <button style={{ backgroundColor: '#c82333', color: 'white', border: '2px solid black', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }} onClick={handleClearOption}>Clear Option</button>&nbsp;&nbsp;
                                    <button style={{ backgroundColor: '#e0a800', color: 'white', border: '2px solid black', padding: '10px 20px', borderRadius: '10px' }} onClick={handlePreviousQuestion}>Previous Question</button>&nbsp;&nbsp;
                                    <button style={{ backgroundColor: '#e0a800', color: 'white', border: '2px solid black', padding: '10px 20px', borderRadius: '10px' }} onClick={handleNextQuestion}>Next Question</button>&nbsp;&nbsp;
                                    <button style={{ backgroundColor: '#28a745', color: 'white', border: '2px solid black', padding: '10px 20px', borderRadius: '10px' }} onClick={handleSubmit}>Submit</button>&nbsp;&nbsp;
                                    </div>
                                </Card.Body>
                            </Card>
                            <br />
                        </Col>
                        <Col md={4}>
                            <Card className="custom-card-height" style={{ overflow: 'auto' }}>
                                {/* <Card.Header>Candidate Information</Card.Header> */}
                                <Card.Body >
                                <Row>
                                    <Col md={6} className="candidateInfo" style={{maxWidth: '180px'}} >
                                        <img src={userLogin2} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    </Col>
                                    <Col md={6} className="candidateInfo" >
                                        <label htmlFor="candidateId">Candidate Id:</label>
                                        <p id="candidateId">{candidateId}</p>
                                        <label htmlFor="candidateName">Candidate Name:</label>
                                        <p id="candidateName" >{candidateName}</p>
                                        <label htmlFor="candidateSign">Candidate Signature:</label>
                                        <p id="candidateSign" >test_signature</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <div className="table-container">
                                        <table className="question-table">
                                            <tbody>
                                                <tr>
                                                    <td style={{textAlign: 'left'}} colSpan={15}>Questions : </td>
                                                </tr>
                                                {rows}
                                            </tbody>
                                        </table>
                                    </div>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    </>
                ) : (
                    <ExamCompleted />
                )
            ) : (
                <>
                <Container className="display-time-container">
                    <Alert>{(timeLeft) && (<p>Loading Time</p>)}</Alert>
                </Container>
                </>
                
            )}
            <br />
            </>
    )
}

export default DisplayQuestion;