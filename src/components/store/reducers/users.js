import { createSlice } from "@reduxjs/toolkit";
import { addToNewsLetter } from "../utils/thunks";


export const userSlice = createSlice({
    name: 'users',
    initialState: {
        action: {}
    },
    reducers: {
        clearNewsLetter: (state) => {
            state.action = {};
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addToNewsLetter.fulfilled, (state, action) => {
            state.articles = action.payload;
        })
    }
});

export const {clearNewsLetter} = userSlice.actions;
export default userSlice.reducer;