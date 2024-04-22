import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async(userCred) => {
        const response = await axios.post("http://localhost:5000/login",userCred);
        const data = await response.data;
        return data;
    }
)

const userSlice = createSlice({
    name:'user',
    initialState: {
        userObj: null,
    },
    reducers: {
        clearUser:(state) => {
            state.userObj = null;
        }
    },
    extraReducers:(builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.userObj = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.userObj = action.payload;
        })
        .addCase(loginUser.rejected, (state) => {
            state.userObj = null;
        });
    }
})

export default userSlice.reducer;
export const { clearUser } = userSlice.actions;