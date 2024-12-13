import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Comments from "~/models/Comment";
import Users from "~/models/Users";

export interface SocketState {
  stockStatus: { [productId: number]: number };
  comments: Comments[];
  user: Users;
}

const initialState: SocketState = {
  stockStatus: {},
  comments: [],
  user: {
    id: 0,
    fullname: "",
    password: "",
    email: "",
    phone: "",
  },
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateProductStock: (
      state,
      action: PayloadAction<{ id: number; stock: number }>
    ) => {
      const { id, stock } = action.payload;
      state.stockStatus[id] = stock;
    },
    updateOrderStock: (
      state,
      action: PayloadAction<{ productId: number; newStock: number }>
    ) => {
      const { productId, newStock } = action.payload;
      state.stockStatus[productId] = newStock;
    },
    addNewComment: (state, action: PayloadAction<Comments>) => {
      state.comments = [action.payload, ...state.comments]; // Thêm comment mới vào đầu danh sách
    },
    updateProfileUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  updateProductStock,
  updateOrderStock,
  addNewComment,
  updateProfileUser,
} = socketSlice.actions;
export default socketSlice.reducer;
