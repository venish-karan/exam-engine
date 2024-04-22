import { createSlice } from '@reduxjs/toolkit';

const CandidateTimeSlice = createSlice({
    name: "candidateTime",
    initialState: {
        value: null,
    },
    reducers: {
        timeStore: (state) => {
            state.value -= 1;
        },
        setTimeValue: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { timeStore, setTimeValue } = CandidateTimeSlice.actions;
export default CandidateTimeSlice.reducer;