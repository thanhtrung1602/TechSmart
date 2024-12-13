import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import cookieReducer from "./cookieSlice";
import cartReducer from "./cartSlice";
import addressReducer from "./addressSlice";
import menuReducer from "./menuSlice";
import userProfileReducer from "./userProfileSlice";
import socketReducer from './socketSlice';
export const store = configureStore({
  reducer: {
    cookie: cookieReducer,
    cart: cartReducer,
    userProfile: userProfileReducer,
    address: addressReducer,
    menu: menuReducer,
    socket: socketReducer,
  },
  // Middleware mặc định bao gồm thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(), // Không cần thêm thunk ở đây nữa
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
