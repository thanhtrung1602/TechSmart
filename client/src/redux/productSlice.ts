import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    imageProduct: "",
  },
  reducers: {
    setImageProduct: (state, action) => {
      state.imageProduct = action.payload;
    },
  },
});

export const { setImageProduct } = productSlice.actions;
export default productSlice.reducer;
