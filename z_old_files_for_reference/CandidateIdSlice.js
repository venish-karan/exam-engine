import { createSlice } from "@reduxjs/toolkit";

const CandidateIdSlice = createSlice({
    name: 'candidateId',
    initialState: {
        value: '',
    },
    reducers: {
        candidateIdStore: (state, action) => {
            // state.value += action.payload;
            state.value = action.payload;
        },
    }
});

export const { candidateIdStore } = CandidateIdSlice.actions;
export default CandidateIdSlice.reducer;