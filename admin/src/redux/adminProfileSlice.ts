import { createSlice } from "@reduxjs/toolkit";
import Users from "~/models/Users";
import { decryptData, encryptData } from "~/utils/crypto";

// Lấy adminProfile từ localStorage nếu có và giải mã
const encryptedAdminProfile = localStorage.getItem("adminProfile");
const adminProfile = encryptedAdminProfile
  ? decryptData(encryptedAdminProfile)
  : "";

const initialState: { adminProfile: Users | null } = {
  adminProfile: adminProfile ? JSON.parse(adminProfile) : null,
};

const adminSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {
    setAdminProfile: (state, action) => {
      state.adminProfile = action.payload;
      //Mã hóa và lưu vào localStorage
      const encryptedAdmin = encryptData(JSON.stringify(action.payload));
      localStorage.setItem("adminProfile", encryptedAdmin);
    },
    removeAdminProfile: (state) => {
      state.adminProfile = null;
      // Xóa adminProfile khỏi localStorage khi người dùng đăng xuất
      localStorage.removeItem("adminProfile");
      window.location.reload();
    },
  },
});

export const { setAdminProfile, removeAdminProfile } = adminSlice.actions;
export default adminSlice.reducer;
