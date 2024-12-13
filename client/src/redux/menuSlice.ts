import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    activeMenu: sessionStorage.getItem("menuActive") || "home", // lấy từ sessionStorage
    previousMenu: sessionStorage.getItem("menuActive") || "home", // lấy từ sessionStorage
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveMenu(state, action: PayloadAction<string>) {
            state.previousMenu = state.activeMenu; // lưu menu cũ
            state.activeMenu = action.payload; // cập nhật menu hiện tại
            sessionStorage.setItem("menuActive", action.payload); // lưu vào sessionStorage
        },
        previousMenu(state) {
            state.activeMenu = state.previousMenu;
        },
        resetActiveMenu(state) {
            state.activeMenu = ""; // Reset trạng thái activeMenu về null
            sessionStorage.removeItem('menuActive'); // Xóa menuActive khỏi sessionStorage
        },
    },
});

export const { setActiveMenu, resetActiveMenu, previousMenu } = menuSlice.actions;
export default menuSlice.reducer;
