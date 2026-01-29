import { createSlice } from "@reduxjs/toolkit";
import { fetchPosts, fetchPostsByID } from "../utils/thunks";


export const postSlice = createSlice({
    name: 'posts',
    initialState: {
        loading: true,
        articles: {
            items: []
        }
    },
    reducers: {
        clearPostByID: (state) => {
            state.postByID = {}
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.loading = false;
            state.articles = action.payload;
        })
        .addCase(fetchPosts.rejected, (state) => {
            state.loading = false;
        })
        .addCase(fetchPostsByID.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchPostsByID.fulfilled, (state, action) => {
            state.loading = false;
            state.postByID = action.payload;
        })
        .addCase(fetchPostsByID.rejected, (state) => {
            state.loading = false;
        })
    }
});

export const { clearPostByID } = postSlice.actions
export default postSlice.reducer;