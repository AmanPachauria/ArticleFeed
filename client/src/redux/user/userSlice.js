import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  userListings: [],
  error: null,
  loading: false,
  articleLosding: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state, action) => {
      (state.currentUser = null), (state.loading = false);
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUserListingStart: (state) => {
      state.articleLosding = true;
    },
    setUserListingSuccess: (state, action) => {
      state.userListings = action.payload;
      state.articleLosding = false;
      state.error = null;
    },
    setUserListingFailure: (state, action) => {
      state.userListings = action.payload;
      state.articleLosding = false;
    },
    setDeleteListing: (state, action) => {
        const deletedListingId = action.payload; // Assuming action.payload contains the deleted listing ID
        state.userListings = state.userListings.filter(
          (userListing) => userListing._id !== deletedListingId
        );
    },
      
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  setUserListingStart,
  setUserListingSuccess,
  setUserListingFailure,
  setDeleteListing
} = userSlice.actions;

export default userSlice.reducer;
