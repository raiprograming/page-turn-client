import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlicer';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer the `RootState`, `AppDispatch` and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {user: UserState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
