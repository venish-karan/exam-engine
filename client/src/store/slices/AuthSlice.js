import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {},
    reducers: {
        setAuth: (state, action) => {
            return {...state, ...action.payload};
        },
        clearAuth: (state, action) => {
            return {};
        }
    }
});

export const { setAuth, clearAuth } = AuthSlice.actions;
export default AuthSlice.reducer;