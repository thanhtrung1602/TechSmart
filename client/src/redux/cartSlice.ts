import { createSlice } from "@reduxjs/toolkit";
import Carts from "~/models/Carts";

export interface CartState {
  cartProducts: Carts[];
}
// Hàm lấy giỏ hàng từ localStorage dựa trên userProfile
const getCartFromLocalStorage = () => {
  //Lấy giỏ hàng từ local nếu chưa đăng nhập
  return JSON.parse(localStorage.getItem("tempCart") || "[]");
};

const initialState: CartState = {
  cartProducts: getCartFromLocalStorage(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cartProducts = action.payload;
      localStorage.setItem("tempCart", JSON.stringify(state.cartProducts));
    },
    addProduct: (state, action) => {
      const product = {
        ...action.payload,
        quantity: 1,
        userId: null,
      };
      const index = state.cartProducts.findIndex(
        (s) =>
          s.id === product.id &&
          s.userId === product.userId &&
          s.rom === product.rom &&
          s.color === product.color
      );

      if (index === -1) {
        state.cartProducts.push(product);
      } else {
        state.cartProducts[index].quantity++;
      }
      // Lưu lại giỏ hàng vào localStorage
      localStorage.setItem("tempCart", JSON.stringify(state.cartProducts));
    },
    updateQuantity: (state, action) => {
      const { id, rom, color, quantity } = action.payload;
      const index = state.cartProducts.findIndex(
        (s) => s.id === id && s.rom === rom && s.color === color
      );
      if (index !== -1) {
        state.cartProducts[index].quantity = quantity;
      }

      // Lưu lại giỏ hàng vào localStorage
      localStorage.setItem("tempCart", JSON.stringify(state.cartProducts));
    },
    removeProduct: (state, action) => {
      const product = { ...action.payload };
      const index = state.cartProducts.findIndex(
        (s) =>
          s.id === product.id &&
          s.rom === product.rom &&
          s.color === product.color
      );
      if (index !== -1) {
        state.cartProducts.splice(index, 1);
      }

      // Nếu giỏ hàng trống, xóa item khỏi localStorage
      if (state.cartProducts?.length === 0) {
        localStorage.removeItem("tempCart");
      } else {
        localStorage.setItem("tempCart", JSON.stringify(state.cartProducts));
      }
    },
    removeCart: (state) => {
      state.cartProducts = [];
      // Xóa giỏ hàng khỏi localStorage
      localStorage.removeItem("tempCart");
    },
  },
});

export const {
  addProduct,
  updateQuantity,
  removeProduct,
  removeCart,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;
