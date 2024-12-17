import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    imageProduct: "",
    changePrice: 0,
  },
  reducers: {
    setImageProduct: (state, action) => {
      state.imageProduct = action.payload;
    },
    setPrice: (state, action) => {
      state.changePrice = action.payload;
    },
  },
});

export const { setImageProduct, setPrice } = productSlice.actions;
export default productSlice.reducer;
