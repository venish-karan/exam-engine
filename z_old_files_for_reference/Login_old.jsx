import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        candidateId : '',
        candidatePassword : ''
    });
    
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        // to stop from refreshing the page
        event.preventDefault();
        axios.post("http://localhost:5000/login", inputs)
        .then((res) => {
            if(res.data.Status === "Success") {
                navigate("/");
            }else {
                alert("candidate id or password is incorrect, please try again");
            }
        })
        .catch((err)=> console.log(err));
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="candidateId">Candidate ID: </label>
                <input type="text" name="candidateId" onChange={(event) => setInputs({...inputs, candidateId:event.target.value})} /><br />
                <label htmlFor="candidatePassword">Password: </label>
                <input type="password" name="candidatePassword" onChange={(event) => setInputs({...inputs, candidatePassword:event.target.value})} /><br />
                <button type="submit">Login</button><br />
                <Link to="/register">Register</Link><br />
            </form>
        </div>
    )
}

export default Login;