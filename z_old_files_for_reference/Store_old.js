import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import CandidateScoreReducer from './slices/CandidateScoreSlice';
import CandidateTimeReducer from './slices/CandidateTimeSlice';
import CandidateIdSlice from './slices/CandidateIdSlice';
import UserSlice from './slices/UserSlice';

const persistConfig = {
    key: "root",
    storage, // browser local storage by default value
};

const rootReducer = combineReducers({
    user: UserSlice,
    candidateScore: CandidateScoreReducer,
    candidateTime: CandidateTimeReducer,
    candidateId: CandidateIdSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export default store;