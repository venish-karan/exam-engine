import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { candidateIdStore } from "../store/slices/CandidateIdSlice";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleDelete = () => {
        
        dispatch(candidateIdStore(''));
        axios.get("http://localhost:5000/logout")
        .then(res => {
            // window.location.reload(true);
            navigate("/login");
        })
        .catch(error => console.log(error));
    }

    return (
        <>
            <button onClick={handleDelete}>Logout</button>
        </>
    )
}

export default Logout;