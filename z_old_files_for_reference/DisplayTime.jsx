// import React, { useEffect, useState } from "react";
// import "./DisplayTime.css";
// import { useDispatch, useSelector } from 'react-redux';
// import { timeStore, setTimeValue } from "../store/slices/CandidateTimeSlice";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import useAuth from '../hooks/useAuth';

// const CANDIDATE_TIME_URL = "/candidateTime";

// const DisplayTime = () => {
    // const dispatch = useDispatch();
    // const { auth } = useAuth();
    // const userName = auth.user;
    // const axiosPrivate = useAxiosPrivate();
    // const candidateExamTime = useSelector((state) => state.candidateTime.value);
    // const [candidateExamTime, setCandidateExamTime] = useState(null);

    // useEffect(() => {
    //     const getTime = async () => {
    //         const response = await axiosPrivate.post('/getCandidateTime', JSON.stringify({ userName }));
    //         console.log("response");
    //         console.log(response.data);
    //         setCandidateExamTime(response.data);
    //         // dispatch(setTimeValue(response.data));
    //     }
    //     getTime();
        
    // }, []);

    // const intervalIds = [];

    // useEffect(() => {
    //     if(candidateExamTime > 0) {

    //         const intervalId1 = setInterval(() => {
    //             setCandidateExamTime(prevTime => prevTime - 1);
    //             // dispatch(timeStore());
    //         }, 1000);
    
    //         intervalIds.push(intervalId1);

    //     }

    //     return () => {
    //         intervalIds.forEach(clearInterval);
    //     }
    // }, [candidateExamTime]);

    // const updateTimeInDb = async () => {
    //     try {
    //         await axiosPrivate.post('/updateCandidateTime', JSON.stringify({ userName, candidateExamTime }));
    //     } catch (err) {
    //         console.error("error in updating time in db: ", err);
    //     }
    // }

    // const intervalId2 = setInterval(updateTimeInDb, 10000); // change to 1 min = 60000 milliseconds

    // clearInterval(intervalId2);

    // useEffect(() => {
    //     const updateTimeInDb = async () => {
    //         try {
    //             await axiosPrivate.post('/updateCandidateTime', JSON.stringify({ userName, candidateExamTime }));
    //         } catch (err) {
    //             console.error("error in updating time in db: ", err);
    //         }
    //     };
    
    //     const intervalId = setInterval(updateTimeInDb, 60000); // Set interval for 1 minute
    
    //     // Clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, [userName, candidateExamTime]);
    

//     return (
        // <div className="display-time-container">
        //     <p> Candidate Time Left : { candidateExamTime }</p>
        // </div>
//     )
// }

// export default DisplayTime;