import { createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user");

const initialState = {
  user,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      localStorage.clear();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", state.user || "");
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
export default authReducer;
