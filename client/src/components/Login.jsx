import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import './Register.css';
import './Login.css';
import useAuth from '../hooks/useAuth';

import { Button, Form, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// import { useDispatch } from 'react-redux';
// import { setCredentials } from '../features/auth/authSlice';
// import { useLoginMutation } from '../features/auth/authApiSlice';

const LOGIN_URL = '/auth';
const EXAM_DETAILS = '/examdetails';

const Login = () => {
    // const dispatch = useDispatch();
    // const { auth, updateAuth } = useAuth();
    const { updateAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';


    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [examCode, setExamCode] = useState(0);
    const [subjectCode, setSubjectCode] = useState(0);
    const [examDate, setExamDate] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [examDetails, setExamDetails] = useState([]);
    const [filteredSubjectCodes, setFilteredSubjectCodes] = useState([]);
    const [filteredExamDates, setFilteredExamDates] = useState([]);
    const [examDetailLoading, setExamDetailLoading] = useState(false);

    // const [success, setSuccess] = useState(''); 

    // const [ login, {isLoading} ] = useLoginMutation();
    // const dispatch = useDispatch();

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

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

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

    // useEffect(() => {
    //     if(success) navigate('/');
    // }, [success]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const examAttended = 'Y';

        try {

            const response = await axios.post(LOGIN_URL,
                JSON.stringify({user, examCode, subjectCode, examDate, pwd, examAttended}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            const candidateId = response?.data?.candidateId;
            const examCodeRes = response?.data?.examCode;
            const examNameRes = response?.data?.examName;
            const subjectCodeRes = response?.data?.subjectCode;
            const subjectNameRes = response?.data?.subjectName;
            const examDateRes = response?.data?.examDate;

            console.log("roles: " + roles);

            // dispatch(setAuth(user, pwd, roles, accessToken));
            updateAuth({user, candidateId, examCodeRes, examNameRes, subjectCodeRes, subjectNameRes, examDateRes, pwd, roles, accessToken});
            setUser('');
            setExamCode(0);
            setSubjectCode(0);
            setExamDate('');
            setPwd('');
            // setSuccess(true);
            console.log("after login it navigates to " + from);
            navigate(from, { replace: true });

        } catch (err) {
            console.log(err);
            if(!err?.response) {
                setErrMsg('No Server Response');
            } else if(err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if(err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
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
        <br/>
        <br/>
        <div className='loginComponent'>
        <section className='loginSection'>
            <Alert ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive' >{errMsg}</Alert>
            <h3>Login In</h3>
            <br />
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group>
                        <Form.Label>Candidate Name</Form.Label>
                        <Form.Control 
                            type='text' 
                            id='username'
                            ref={userRef}
                            placeholder='Type your user name here'
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            autoComplete='off'
                        />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type='password'
                                id='password'
                                placeholder='Type your Password here'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                    <Form.Group>
                    <Form.Label>Exam Code</Form.Label>
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
                    <Form.Label>Subject Code</Form.Label>
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
                    <Form.Label>Exam Date</Form.Label>
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
                <br />                
                <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Login In</button>

            </Form>
            <br />
            <Alert variant='success'>
                If not registered?
                <span className='line'>
                    <Link to='/register' style={{textDecoration: 'none'}}>&nbsp;Candidate Registration</Link>
                </span>
            </Alert>

        </section>
        </div>
        <br />
        </>
    )
};

export default Login;