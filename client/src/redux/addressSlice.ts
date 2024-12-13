import { createSlice } from "@reduxjs/toolkit";
import { IAddress } from "~/models/Address";

export interface SaveResult {
  stock: boolean;
  message: string;
  deliveryTime: string;
  pickupTime: string;
  deliveryDate: string | null;
}

const initialState = {
  addressId: 0,
  provinceId: 0,
  hiddenForm: false,
  addressData: {} as IAddress,
  addAddressData: false,
  selectIdAddress: 0,
  selectIdStore: 0,
  deliveryType: true,
  resultValueStock: {} as SaveResult,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressId: (state, action) => {
      state.addressId = action.payload;
    },
    setProvinceId: (state, action) => {
      state.provinceId = action.payload;
    },
    setHiddenForm: (state) => {
      state.hiddenForm = !state.hiddenForm;
    },

    setAddressData: (state, action) => {
      state.addressData = action.payload;
    },
    setAddAddressData: (state, action) => {
      state.addAddressData = action.payload;
    },
    setSelectIdAddress: (state, action) => {
      state.selectIdAddress = action.payload;
    },
    setSelectIdStore: (state, action) => {
      state.selectIdStore = action.payload;
    },
    setDeliveryType: (state, action) => {
      state.deliveryType = action.payload;
    },

    setResultValueStock: (state, action) => {
      state.resultValueStock = action.payload;
    },
  },
});

export const {
  setAddressId,
  setProvinceId,
  setHiddenForm,
  setAddressData,
  setAddAddressData,
  setSelectIdAddress,
  setDeliveryType,
  setSelectIdStore,
  setResultValueStock,
} = addressSlice.actions;
export default addressSlice.reducer;
