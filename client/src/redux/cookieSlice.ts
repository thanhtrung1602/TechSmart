import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  accessToken: null,
  refreshToken: null,
};

const cookieSlice = createSlice({
  name: "cookie",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
  },
});

export const { setAccessToken, setRefreshToken } = cookieSlice.actions;
export default cookieSlice.reducer;
