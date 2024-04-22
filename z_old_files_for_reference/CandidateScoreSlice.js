import { createSlice } from "@reduxjs/toolkit";

const CandidateScoreSlice = createSlice({
    name: 'candidateScore',
    initialState: {
        value: 0,
    },
    reducers: {
        scoreStore: (state, action) => {
            // state.value += action.payload;
            state.value = Object.values(action.payload).reduce((acc, val) => acc + val,0);
        },
    }
});

export const { scoreStore } = CandidateScoreSlice.actions;
export default CandidateScoreSlice.reducer;