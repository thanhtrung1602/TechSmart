import { createSlice } from "@reduxjs/toolkit";
import Users from "~/models/Users";
import { decryptData, encryptData } from "~/utils/crypto";

// Lấy userProfile từ localStorage nếu có và giải mã
const encryptedUserProfile = localStorage.getItem("userProfile");
const userProfile = encryptedUserProfile
  ? decryptData(encryptedUserProfile)
  : "";

const initialState: { userProfile: Users | null } = {
  userProfile: userProfile ? JSON.parse(userProfile) : null,
};

const userSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
      //Mã hóa và lưu vào localStorage
      const encryptedUser = encryptData(JSON.stringify(action.payload));
      localStorage.setItem("userProfile", encryptedUser);
    },
    removeUserProfile: (state) => {
      state.userProfile = null;
      // Xóa userProfile khỏi localStorage khi người dùng đăng xuất
      localStorage.removeItem("userProfile");
      window.location.reload();
    },
  },
});

export const { setUserProfile, removeUserProfile } = userSlice.actions;
export default userSlice.reducer;
