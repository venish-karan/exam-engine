import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import DisplayTime from './DisplayTime';
import ExamCompleted from "./ExamCompleted";
import useAuth from '../hooks/useAuth';
// import { scoreStore } from "../store/slices/CandidateScoreSlice";

import "./DisplayQuestion.css"

const QUESTIONS_URL = 'questions';
const RESPONSE_URL = 'response';

const DisplayQuestion = () => {

    const dispatch = useDispatch();
    const { auth } = useAuth();
    const userName = auth.user;
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const candidateTime = useSelector((state) => state.candidateTime.value);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // here question number starts with 0 so add 1 to it
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    // selectedAnswer is marks
    const [selectedAnswer, setSelectedAnswer] = useState({});

    useEffect(()=> {
        console.log("Selecteed Answer");
        console.log(selectedAnswer);
    }, [selectedAnswer]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getQuestions = async () => {

            try {

                const response = await axiosPrivate.post(QUESTIONS_URL, JSON.stringify({userName}) ,{
                    signal: controller.signal
                });

                isMounted && setQuestions(response.data);
                setLoading(false);

            } catch(err) {

                console.log(err);
                navigate('/login', { state: {from:location}, replace: true });
            }
        }
        getQuestions();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    // useEffect(() => {
    //     const handleSelectedAnswer = () => {
    //         const currQuestion = questions[currentQuestionIndex];
    //         console.log("currQuestion: " + currQuestion);
    //         console.log(currQuestion);
    //         if(currQuestion) {
    //             const correctAnswer = currQuestion.correctAnswer;
    //             console.log(correctAnswer + " " + currentSelectedOption);
    //             setSelectedAnswer((prevState) => {
    //                 return {...prevState, [currentQuestionIndex]: Number(correctAnswer === currentSelectedOption) }
    //             });
    //         }
    //     }
    //     handleSelectedAnswer();
    // }, [selectedOption, currentQuestionIndex, questions]);

    // useEffect(() => {
    //     dispatch(scoreStore(selectedAnswer));
    //     // setTotalScore((prevScore) => {
    //     //     return Object.values(selectedAnswer).reduce((acc, val) => acc + val,0);
    //     // });

    // },[selectedAnswer]);

    useEffect(() => {

        const updateResponse = () => {
            const controller = new AbortController();
            
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
            
            controller.abort();
        }
        updateResponse();

    }, [selectedOption]);

    const currentQuestion = questions[currentQuestionIndex];
    const currentSelectedOption = selectedOption[currentQuestionIndex];

    const handleOptionChange = (option) => {
        setSelectedOption((previousState) => {
            return {...previousState, [currentQuestionIndex]: option
            };
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
            {(candidateTime > 0) ? (
                <div className="question-body">
                    <h5><DisplayTime /></h5>
                    {currentQuestion && (
                    <div className="question-container">
                        <p>{currentQuestion.text}</p>
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
                                        <label htmlFor={`option_${index}`}>{option}</label>
                                    </li>
                                ) : null
                            )}
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
    )
}

export default DisplayQuestion;