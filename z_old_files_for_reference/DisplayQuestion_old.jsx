import React, { useEffect, useState } from "react"
import "./DisplayQuestion.css"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scoreStore } from "../store/slices/CandidateScoreSlice";
import axios from 'axios';
import DisplayTime from './DisplayTime';


const DisplayQuestion = () => {

    // const [auth, setAuth] = useState(false);
    // const [message, setMessage] = useState('');
    // const [candidateId, setCandidateId] = useState();
    // axios.defaults.withCredentials = true;


    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const questions = [
    //     {
    //         id: 1,
    //         text: "1 This is a question ?",
    //         options: ["1option1", "1option2", "1option3", "1option4"],
    //         correctAnswer: "1option1"
    //     },
    //     {
    //         id: 2,
    //         text: "2 This is a question ?",
    //         options: ["2option1", "2option2", "2option3", "2option4"],
    //         correctAnswer: "2option1"
    //     },
    //     {
    //         id: 3,
    //         text: "3 This is a question ?",
    //         options: ["3option1", "3option2", "3option3", "3option4"],
    //         correctAnswer: "3option1"
    //     },
    //     {
    //         id: 4,
    //         text: "4 This is a question ?",
    //         options: ["4option1", "4option2", "4option3", "4option4"],
    //         correctAnswer: "4option1"
    //     },
    //     {
    //         id: 5,
    //         text: "5 This is a question ?",
    //         options: ["5option1", "5option2", "5option3", "5option4"],
    //         correctAnswer: "5option1"
    //     }
    // ]

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState({});
    // const [totalScore, setTotalScore] = useState(0);

    // console.log("questions: " + questions);

    // console.log(questions[currentQuestionIndex].correctAnswer);
    // console.log(selectedOption[currentQuestionIndex]);
    // console.log(selectedAnswer);
    // console.log("useState " + totalScore);
    // console.log("redux " + score);

    // useEffect(() => {
    //     axios.get('http://localhost:5000/')
    //     .then((res) => {
    //         if(res.data.Status === "Success") {
    //             setAuth(true);
    //             setCandidateId(res.data.candidate_id);
    //         } else {
    //             setAuth(false);
    //             setMessage(res.data.Error);
    //             navigate('/login');
    //         }
    //     })
    // }, []);

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

        // console.log(totalScore);
        // console.log(selectedOption);
        navigate("/examCompleted");
    }

    if(loading) {
        return (<h3>Loading...</h3>);
    }

    return (
        <div className="question-body">
            <h3><DisplayTime /></h3>
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
    )
}

export default DisplayQuestion;