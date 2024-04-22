import React from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

const useDbTime = () => {
    const { auth } = useAuth();
    const userName = auth.user;
    const axiosPrivate = useAxiosPrivate();

    const getTime = async () => {
        try {
            const response = await axiosPrivate.post('/getCandidateTime', JSON.stringify({ userName }));
            console.log("response");
            console.log(response.data);
            return response.data;
        } catch (err) {
            console.error("Error in getting time: ", err);
            return err;
        }
    }

    const updateTime = async (candidateExamTime) => {
        try {
            const response = await axiosPrivate.post('/updateCandidateTime', JSON.stringify({ userName, candidateExamTime }));
            console.log("response from updating time: ");
            console.log(response);
            return;
        } catch (err) {
            console.error("error in updating time in db: ", err);
            return err;
        }
    }

    return { getTime, updateTime };
}

export default useDbTime;