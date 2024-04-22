import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from "react-router-dom";
import "./QuestionBuilder.css";
// import axios from '../api/axios';

const QUESTION_BUILDER_URL = '/questionBuilder';

const QuestionBuilder = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    // const [subjectName, setSubjectName] = useState('');
    // const [subjectCode, setSubjectCode] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [option5, setOption5] = useState('');
    const [correctOptionId, setCorrectOptionId] = useState('');
    const [correctOption, setCorrectOption] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [currentForm, setCurrentForm] = useState('subject');
    const [alertMsg, setAlert] = useState('');

    const subjectName = useRef('');
    const subjectCode = useRef('');
    const subjectNameRef = useRef(null);
    const errRef = useRef(null);
    const alertRef = useRef(null);

    useEffect(() => {
        subjectNameRef.current && subjectNameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg(''); 
        // setAlert('');
    },[subjectName.current, subjectCode.current, questionText, option1, option2, option3, option4, option5, correctOptionId, correctOption]);

    useEffect(() => {
        setTimeout(() => {
            setAlert('');
        }, 5000);
    }, [alertMsg]);

    const subjectSubmit = async (event) => {
        event.preventDefault();
        setCurrentForm('question');
    }

    const questionSubmit = async (event) => {
        event.preventDefault();

        if(subjectName.current === '' || subjectCode.current === '') {
            setCurrentForm('subject');
            setErrMsg('subject name and subject code should not be empty');
            errRef.current.focus();
            return;
        }

        const controller = new AbortController();

        try {
            let currentSubjectName = subjectName.current;
            let currentSubjectCode = subjectCode.current;

            const response = await axiosPrivate.post(QUESTION_BUILDER_URL,
                JSON.stringify({
                    subjectName: currentSubjectName, 
                    subjectCode: currentSubjectCode, 
                    questionText, 
                    option1, 
                    option2, 
                    option3, 
                    option4, 
                    option5, 
                    correctOptionId, 
                    correctOption
                }),{
                signal: controller.signal
            });
            
            console.log(response?.data);
            setAlert(response?.data);
            alertRef.current && alertRef.current.focus();

            // setSubjectName('');
            // setSubjectCode('');
            subjectName.current = '';
            subjectCode.current = '';
            setQuestionText('');
            setOption1('');
            setOption2('');
            setOption3('');
            setOption4('');
            setOption5('');
            setCorrectOptionId('');
            setCorrectOption('');

            controller.abort();

            setCurrentForm('subject');

        } catch(err) {
            console.log(err);
            setAlert('');
            if(!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data);
            }
            errRef.current.focus();
            // navigate('/login', { state: {from:location}, replace: true });
        }            
    }
    console.log("alert:" + alertMsg);
    console.log("err:" + errMsg);
    console.log("sub name:" + subjectName.current);
    console.log("sub code:" + subjectCode.current);
    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
            <p ref={alertRef} className={alertMsg ? "alert" : "offscreen"} aria-live='assertive'>{alertMsg}</p>

            <h1>Question Paper Builder</h1>
            {currentForm === 'subject' ? (
                <form onSubmit={subjectSubmit}>
                    <label htmlFor='subjectName'>
                        Subject Name
                    </label>
                    <br />
                    <input 
                        type="text"
                        id="subjectName"
                        ref={subjectNameRef}
                        // onChange={(e) => setSubjectName(e.target.value)}
                        onChange={(event) => { subjectName.current = event.target.value; }}
                        // value={subjectName.current}
                        required
                        autoComplete='off'
                    />
                    <br />
                    <br />
                    <label htmlFor='subjectCode'>
                        Subject Code
                    </label>
                    <br />
                    <input 
                        type="text"
                        id="subjectCode"
                        // onChange={(e) => setSubjectCode(e.target.value)}
                        onChange={(event) => { subjectCode.current = event.target.value; }}
                        // value={subjectCode.current}
                        required
                        autoComplete='off'
                    />
                    <br />
                    <br />
                    <button>Submit</button>
                </form>
            ) : (
                <section>
                    <button onClick={() => setCurrentForm('subject') }>Change Subject</button>
                    <br />
                    <br />
                    <form onSubmit={questionSubmit}>
                        <label htmlFor='questionText'>
                            Question Text
                        </label>
                        <br />
                        <input 
                            type="text"
                            id="questionText"
                            onChange={(e) => setQuestionText(e.target.value)}
                            value={questionText}
                            required
                            autoComplete='off'
                        />
                        <br />
                        <br />
                        <label htmlFor='option1'>
                            Option 1
                        </label>
                        <br />
                        <input 
                            type="text"
                            id="option1"
                            onChange={(e) => setOption1(e.target.value)}
                            value={option1}
                            required
                            autoComplete='off'
                        />
                        <br />
                        <br />
                        <label htmlFor='option2'>
                            Option 2
                        </label>
                        <br />
                        <input 
                            type="text"
                            id="option2"
                            onChange={(e) => setOption2(e.target.value)}
                            value={option2}
                            required
                            autoComplete='off'
                        />
                        <br />
                        <br />
                        <label htmlFor='option3'>
                            Option 3
                        </label>
                        <br />
                        <input 
                            type="text"
                            id="option3"
                            onChange={(e) => setOption3(e.target.value)}
                            value={option3}
                            required
                            autoComplete='off'
                        />
                        <br />
                        <br />
                        <label htmlFor='option4'>
                            Option 4
                        </label>
                        <br />
                        <input 
                            type="text"
                            id="option4"
                            onChange={(e) => setOption4(e.target.value)}
                            value={option4}
                            required
                            autoComplete='off'
                        />
                        <br />
                        <br />
                        <label htmlFor='option5'>
                            Option 5
                        </label>
                        <br />
                        <input 
                            type="text"
                            id="option5"
                            onChange={(e) => setOption5(e.target.value)}
                            value={option5}
                            autoComplete='off'
                        />
                        <br />
                        <br />
                        <select  
                            id="correctOption"
                            onChange={(e) => { const selectedValue = e.target.value;
                                                    setCorrectOption(selectedValue);
                                                    setCorrectOptionId(e.target.selectedIndex);}}
                            value={correctOption}
                            required
                        >
                            <option value="">Select Correct Option</option>
                            <option value={option1}>Option 1: { option1 }</option>
                            <option value={option2}>Option 2: { option2 }</option>
                            <option value={option3}>Option 3: { option3 }</option>
                            <option value={option4}>Option 4: { option4 }</option>
                            <option value={option5}>Option 5: { option5 }</option>

                        </select>

                        <button>Submit</button>
                    </form>
                </section>
            )}
        </section>
    );
};

export default QuestionBuilder;
