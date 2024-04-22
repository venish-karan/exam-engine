import React from "react";
import { useDispatch } from "react-redux";
import { clearAuth } from "../store/slices/AuthSlice";

const Logout = () => {
    const dispatch = useDispatch();

    return (
        <>
            <button type="button" onClick={() => dispatch(clearAuth())}>Logout</button>
        </>
    )
}

export default Logout;