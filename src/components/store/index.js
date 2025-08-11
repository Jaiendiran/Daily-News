import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./reducers/posts";


export const store = configureStore({
    reducer: {
        posts: postReducer
    }
})