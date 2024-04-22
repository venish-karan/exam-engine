import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamCompleted = () => {

    const navigate = useNavigate();
    const [redirectTimer, setRedirectTimer] = useState(5);
    const [redirectTimerChange, setRedirectTimerChange] = useState(redirectTimer);

    useEffect(() => {
        if(redirectTimerChange > 0) {
            setTimeout(() => {
                setRedirectTimerChange((prevState) => {
                    return prevState - 1;
                });
            },1000);
        }
    }, [redirectTimerChange])
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/feedback");
        },redirectTimer*1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <h2>Exam Completed Successfully!</h2>
            <h3>Page will be automatically redirect to score page, After {redirectTimerChange} seconds!!</h3>
        </div>
    )
}

export default ExamCompleted;