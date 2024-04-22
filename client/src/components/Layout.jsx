import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import useCountDown from "../hooks/useCountDown";
import useDbTime from "../hooks/useDbTime";

import { Navbar, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';

const Layout = () => {
    // const candidateId = useSelector((state) => state.candidateId.value);
    const { auth } = useAuth();
    const { timeLeft, start } = useCountDown();
    const { getTime, updateTime } = useDbTime();
    const examCode = auth.examCodeRes;
    const subjectCode = auth.subjectCodeRes;
    const examName = auth.examNameRes;
    const subjectName = auth.subjectNameRes;
    // console.log("timeLeft: " + timeLeft);

    useEffect(() => {
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
    },[]);

    return (
        <main className='layoutApp'>
            <Navbar className="bg-body-tertiary">
                    <Navbar.Brand>Logo Image</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {/* <div className='navbarExam'> */}
                            {/* <Navbar.Text className='navbarExam'>EXAM CODE : <b>{examCode}</b> </Navbar.Text> */}
                            <Navbar.Text className='navbarExam'><b>{examName}</b> </Navbar.Text>
                            {/* <Navbar.Text className='navbarExam'>&nbsp;SUBJECT CODE : <b>{subjectCode}</b></Navbar.Text> */}
                            {/* <Navbar.Text className='navbarExam'>&nbsp;SUBJECT NAME : <b>{subjectName}</b></Navbar.Text> */}
                        {/* </div> */}
                        {/* <div className='navbarTime'> */}
                            <Alert className='navbarTime' style={{backgroundColor: "lightgray", color: "white"}}>&nbsp;Time Left : <b>{(timeLeft) ? timeLeft : 0}</b></Alert>
                        {/* </div> */}
                    </Navbar.Collapse>
            </Navbar>
            <div className="main-content">
                <Outlet />
            </div>
        </main>
    );
};

export default Layout;