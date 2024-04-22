import React from "react";
import { useSelector } from "react-redux";
import Logout from "../client/src/components/Logout";

const DisplayScore = () => {

    const score = useSelector((state) => state.candidateScore.value);

    return (
        <div>
            <h3>Candidate Score:</h3>
            <h2>{score}</h2>
            <Logout />
        </div>
    )
}

export default DisplayScore;