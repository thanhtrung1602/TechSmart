import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import adminProfileReducer from "./adminProfileSlice";
import socketReducer from "./socketSlice";

export const store = configureStore({
  reducer: {
    adminProfile: adminProfileReducer,
    socket: socketReducer,
  },
  // Middleware mặc định bao gồm thunk
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Không cần thêm thunk ở đây nữa
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
