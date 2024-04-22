import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
// import CandidateScoreReducer from './slices/CandidateScoreSlice';
// import CandidateTimeReducer from './slices/CandidateTimeSlice';
// import CandidateIdReducer from './slices/CandidateIdSlice';

const rootReducer = combineReducers({
    auth: AuthReducer,
    // candidateScore: CandidateScoreReducer,
    // candidateId: CandidateIdReducer,
    // candidateTime: CandidateTimeReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;