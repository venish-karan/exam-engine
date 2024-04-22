import React, { useEffect, useState } from "react"
import "./DisplayQuestion.css"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scoreStore } from "../store/slices/CandidateScoreSlice";
import axios from 'axios';
import DisplayTime from './DisplayTime';
import ExamCompleted from "./ExamCompleted";


const DisplayQuestion = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userObj } = useSelector((state) => state.user);
    const candidateTime = useSelector((state) => state.candidateTime.value);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/questions')
        .then(response => {
            setQuestions(response.data);
            // console.log("axios:  ", questions);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error fetching data: ', error);
            // setLoading(false);
        })
    }, []);

    useEffect(() => {
        const handleSelectedAnswer = () => {
            const currQuestion = questions[currentQuestionIndex];
            if(currQuestion) {
                const correctAnswer = currQuestion.correctAnswer;
                setSelectedAnswer((prevState) => {
                    return {...prevState, [currentQuestionIndex]: Number(correctAnswer === currentSelectedOption) }
                });
            }
        }
        handleSelectedAnswer();
    }, [selectedOption, currentQuestionIndex, questions]);

    useEffect(() => {
        dispatch(scoreStore(selectedAnswer));
        // setTotalScore((prevScore) => {
        //     return Object.values(selectedAnswer).reduce((acc, val) => acc + val,0);
        // });

    },[selectedAnswer]);

    const currentQuestion = questions[currentQuestionIndex];
    const currentSelectedOption = selectedOption[currentQuestionIndex];

    const handleOptionChange = (option) => {
        setSelectedOption((previousState) => {
            return {...previousState, [currentQuestionIndex]: option};
        });
    }

    const handleClearOption = () => {
        setSelectedOption((previousState) => {
            return {...previousState, [currentQuestionIndex]: ""};
        });
    }

    const handlePreviousQuestion = () => {
        
        if(currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const handleNextQuestion = () => {
       
        if(currentQuestionIndex < questions.length-1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    const handleSubmit = () => {
        navigate("/examCompleted");
    }

    if(loading) {
        return (<h3>Loading...</h3>);
    }

    return (
        <>
        {userObj ? (
            <>
            {(candidateTime > 0) ? (
                <div className="question-body">
                    <h5>{userObj.candidateId}</h5>
                    <h5><DisplayTime /></h5>
                    {currentQuestion && (
                    <div className="question-container">
                        <p>{currentQuestion.text}</p>
                        <ul className="questionListStyle">
                            {currentQuestion.options.map((option,index) => (
                                <li key={index}>
                                    <input
                                        type="radio"
                                        id={`option_${index}`}
                                        name="options"
                                        value={option}
                                        checked={currentSelectedOption === option}
                                        onChange={() => handleOptionChange(option)}
                                    />
                                    <label htmlFor={`option_${index}`}>{option}</label>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleClearOption}>Clear Option</button>&nbsp;
                        <button onClick={handlePreviousQuestion}>Previous Question</button>&nbsp;
                        <button onClick={handleNextQuestion}>Next Question</button>&nbsp;
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                    )}  
                </div>
            ) : (<ExamCompleted />)}
            </>
        ) : (
            <>
            <button type="button" onClick={() => navigate('/login')}>
                Candidate Login
            </button>
            </>
        )}
        </>
    )
}

export default DisplayQuestion;