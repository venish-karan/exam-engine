import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        candidateName : '',
        candidateId : '',
        candidatePassword : ''
    });

    const handleSubmit = (event) => {
        // to stop from refreshing the page
        event.preventDefault();
        axios.post("http://localhost:5000/register", inputs)
        .then((res) => {
            if(res.data.Status === "Success") {
                navigate("/login");
            }else {
                alert("Error while registering user");
            }
        })
        .catch((err)=> console.log(err));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="candidateName">Candidate Name: </label>
                <input type="text" name="candidateName" onChange={(event) => setInputs({...inputs, candidateName:event.target.value})} /><br />
                <label htmlFor="candidateId">Candidate ID: </label>
                <input type="text" name="candidateId" onChange={(event) => setInputs({...inputs, candidateId:event.target.value})} /><br />
                <label htmlFor="candidatePassword">Password: </label>
                <input type="password" name="candidatePassword" onChange={(event) => setInputs({...inputs, candidatePassword:event.target.value})} /><br />
                <button type="submit">Register</button><br />
                <Link to="/login">Candidate Login</Link><br />
            </form>
        </div>
    )
}

export default Register;