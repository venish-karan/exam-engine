import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/UserSlice';

const Login = () => {

    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [inputs, setInputs] = useState({
        candidateId : "",
        candidatePassword : ""
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogin = (event) => {
        // to stop from refreshing the page
        event.preventDefault();
        setLoading(true);
        setLoginError(null);
        dispatch(loginUser(inputs)).then((res)=>{
            setLoading(false);
            console.log(res.payload);
            if(res.payload!==undefined) {
                setInputs({
                    candidateId:"",
                    candidatePassword:"",
                });
                navigate("/");
            } else {
                if(res.error.message === "Request failed with status code 401") {
                    setLoginError("Access Denied! Invalid username or password. ");
                } else if(res.error.message === "Request failed with status code 404") {
                    console.log("hii");
                    setLoginError(res.error.message);
                }
            }
        });    
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="candidateId">
                    Candidate ID: 
                </label>
                <input 
                    type="text" 
                    name="candidateId" 
                    onChange={(event) => setInputs({...inputs, candidateId:event.target.value})} 
                />
                <br />
                <label htmlFor="candidatePassword">
                    Password: 
                </label>
                <input 
                    type="password" 
                    name="candidatePassword" 
                    onChange={(event) => setInputs({...inputs, candidatePassword:event.target.value})} 
                />
                <br />
                <button type="submit">
                    {loading ? "Loading,please wait..." : "Login"}
                </button>
                <br />
                <Link to="/register">
                    Register
                </Link>
                <br />
                {loginError && <div>{loginError}</div>}
            </form>
        </div>
    )
}

export default Login;