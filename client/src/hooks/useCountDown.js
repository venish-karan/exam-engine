import {useEffect, useState} from 'react';

const useCountDown = () => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if(timeLeft <= 0) return;
        
        const timeInterval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        
        return () => clearInterval(timeInterval);
    }, [timeLeft]);

    const start = (candidateTime) => {
        setTimeLeft(candidateTime);
    }

    return { timeLeft, start };
}

export default useCountDown;