import { useRef, useState, useEffect } from 'react';
import './Register.css';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

import { Button, Form, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';
const EXAM_DETAILS = '/examdetails';

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [examCode, setExamCode] = useState(0);
    const [subjectCode, setSubjectCode] = useState(0);
    const [examDate, setExamDate] = useState('');

    const [examDetails, setExamDetails] = useState([]);
    const [filteredSubjectCodes, setFilteredSubjectCodes] = useState([]);
    const [filteredExamDates, setFilteredExamDates] = useState([]);
    const [examDetailLoading, setExamDetailLoading] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();

        let isMounted = true;
        const controller = new AbortController();
        setExamDetailLoading(true);

        // immediately invoked function
        ;(async () => {
            try {
                const examDetailsResponse = await axios.get(EXAM_DETAILS, {
                    signal: AbortController.signal
                },{
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                isMounted && setExamDetails(examDetailsResponse.data.examDetailsArray);
                setExamDetailLoading(false);
            } catch (err) {
                console.log(err);
                setErrMsg("Error in retrieving exam details");

            }

        })()

        return () => {
            isMounted = false;
            controller.abort();
        }
    },[]);

    useEffect(()=> {
        const result = USER_REGEX.test(user);
        // console.log(result);
        // console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        // console.log(result);
        // console.log(pwd);
        const match = pwd === matchPwd;
        setValidPwd(result);
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    useEffect(() => {
        const filteredExamDatesArray = [];
        const filteredSubjectCodeArray = [];

        examDetails.filter((subject) => {
            if(parseInt(subject.examCode) === parseInt(examCode)) {
                filteredSubjectCodeArray.push(subject);
            }
        })
        examDetails.filter((date) => {
            if(parseInt(date.examCode) === parseInt(examCode) && parseInt(date.subjectCode) === parseInt(subjectCode)) {
                filteredExamDatesArray.push(date);
            }
        });
        setFilteredExamDates(filteredExamDatesArray);
        setFilteredSubjectCodes(filteredSubjectCodeArray);

    }, [examCode, subjectCode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if(!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        // console.log(user, pwd);
        // setSuccess(true);
        try {
            const examCodeRes = parseInt(examCode);
            const subjectCodeRes = parseInt(subjectCode);

            
            await axios.post(REGISTER_URL, JSON.stringify({ user, pwd, examCode: examCodeRes, subjectCode: subjectCodeRes, examDate }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            // console.log(response.data);
            // console.log(response.accessToken);
            // console.log(JSON.stringify(response));
            setSuccess(true);
            
            //clear input fields
            setUser("");
            setPwd("");
            setMatchPwd("");
            setExamCode(0);
            setSubjectCode(0);
            setExamDate("");

        } catch (err) {
            console.log("register error: ");
            console.log(err);
            if(!err?.response) {
                setErrMsg('No Server Response')
            } else if(err.response?.status === 409) {
                setErrMsg('Username Already Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
        
    }

    if(examDetailLoading) {
        return (
            <h4>Loading Exam Details, Please Wait!!</h4>
        )
    }

    return (
        <>
        <br />
        <div className='registerComponent'>
        {success ? (
            <section>
                <h1>Success!</h1>
                <span className='line'>
                    <Link to='/login'>Candidate Login</Link>
                </span>
            </section>
        ) : (
        <>
        <br />
        <section className='registerSection'>
            <Alert ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</Alert>
            
            <h3>Candidate Registration</h3>

            <Form onSubmit={handleSubmit}>
                <br/>
                <Form.Group>
                <Form.Label >
                    Candidate Name: 
                    <span className={validName ? "valid" : "hide"}>
                        Y
                    </span>
                    <span className={validName || !user ? "hide" : "invalid"}>
                        W
                    </span>
                </Form.Label>
                <Form.Control 
                    type='text'
                    id='username'
                    ref={userRef}
                    placeholder='Type your user name here'
                    autoComplete='off'
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby='uidnote'
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />

                <Alert id='uidnote' className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                    4 to 24 characters.<br/>
                    Must begin with a letter. <br/>
                    Letters, numbers, underscores, hyphen allowed.
                </Alert>
                </Form.Group>
                <br/>
                <Row>
                    <Col>
                        <Form.Group>
                        <Form.Label >
                            Exam Code:
                        </Form.Label>
                        <Form.Control
                            as="select" 
                            id='exam_code'
                            onChange={(e) => setExamCode(e.target.value)}
                            value={examCode}
                            required
                        >
                            <option value="">Select Exam Code</option>
                            {examDetails.map((code) => (
                                <option key={code.examCode} value={code.examCode}>
                                    {code.examName}
                                </option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                        <Form.Label>
                    Subject Code:
                </Form.Label>
                <Form.Control
                    as="select" 
                    id='subject_code'
                    onChange={(e) => setSubjectCode(e.target.value)}
                    value={subjectCode}
                    required
                >
                    <option value="">Select Subject Code</option>
                    {filteredSubjectCodes.map((code) => (
                        <option key={code.subjectCode} value={code.subjectCode}>
                            {code.subjectName}
                        </option>
                    ))}
                </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        
                <Form.Group>
                <Form.Label>
                    Exam Date:
                </Form.Label>
                <Form.Control
                    as="select" 
                    id='exam_date'
                    onChange={(e) => setExamDate(e.target.value)}
                    value={examDate}
                    required
                >
                    <option value="">Select Exam Date</option>
                    {filteredExamDates.map((date) => (
                        <option key={date.examDate} value={date.examDate}>
                            {date.examDate}
                        </option>
                    ))}
                </Form.Control>
                </Form.Group>
                    </Col>
                </Row>

                <br/>
                <Row>
                    <Col>
                    <Form.Group>
                    <Form.Label htmlFor='password'>
                    Password: 
                    <span className={validPwd ? "valid" : "hide"}>Y</span>
                    <span className={validPwd || !pwd ? "hide" : "invalid"}>W</span>
                </Form.Label>
                
                <Form.Control 
                    type='password'
                    id='password'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    placeholder='Type your Password here'
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby='pwdnote'
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />

                <Alert id='pwdnote' className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    8 to 24 characters.<br/>
                    Must include uppercase and lowercase letters, a number and a special character.<br/>
                    Allowed special characters: !@#$%
                </Alert>
                    </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                        <Form.Label>
                    Confirm Password: 
                    <span className={validMatch && matchPwd ? "valid" : "hide"}>
                        Y
                    </span>
                    <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                        W
                    </span>
                </Form.Label>

                <Form.Control 
                    type='password'
                    id='confirm_pwd'
                    autoComplete='off'
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    placeholder='Type your Password here'
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby='confirmnote'
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />

                <Alert id='confirmnote' className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    Must match the first password input field.
                </Alert>
                        </Form.Group>
                    </Col>
                </Row>
                <br/>
                <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }} disabled={!validName || !validPwd || !validMatch ? true : false}>Register</button>
            </Form>
            <br />
            <Alert>
                Already registered?
                <span className='line'>
                    <Link to='/login' style={{textDecoration: 'none'}}>&nbsp;Candidate Login</Link>
                </span>
            </Alert>
        </section>
        </>
        )}
        </div>
        <br />
        </>
    )
};

export default Register;