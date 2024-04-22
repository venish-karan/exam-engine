import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {

    const navigate = useNavigate();

    const goBack = () => navigate('/login');

    return (
        <section>
            <h1>You are unauthorized to access this page.</h1>
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    );
};

export default Unauthorized;