import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Comments from "~/models/Comment";
import Orders from "~/models/Orders";

interface SocketState {
  stockStatus: { [productId: number]: number };
  comments: Comments[]
  cartUpdate: { userId: number, cartId: number };
  orderCreated: Orders[]
}

const initialState: SocketState = {
  stockStatus: {},
  comments: [],
  cartUpdate: { userId: 0, cartId: 0 },
  orderCreated: []
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateProductStock: (state, action: PayloadAction<{ id: number; stock: number }>) => {
      const { id, stock } = action.payload;
      state.stockStatus[id] = stock;
    },
    updateOrderStock: (state, action: PayloadAction<{ productId: number; newStock: number }>) => {
      const { productId, newStock } = action.payload;
      state.stockStatus[productId] = newStock;
    },
    addNewComment: (state, action: PayloadAction<Comments>) => {
      state.comments = [action.payload, ...state.comments]; // Thêm comment mới vào đầu danh sách
    },
    updateCart: (state, action: PayloadAction<{ userId: number; cartId: number }>) => {
      state.cartUpdate = action.payload
    },
    addNewOrder: (state, action: PayloadAction<Orders>) => {
      state.orderCreated = [action.payload]
    }
  },
});

export const { updateProductStock, updateOrderStock, addNewComment, addNewOrder, updateCart } = socketSlice.actions;
export default socketSlice.reducer;

