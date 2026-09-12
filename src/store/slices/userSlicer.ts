import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo, UserState } from '../types';
import { getUserInfoFromStorage } from './userSlicer.utils';

const initialState: UserState = {
  userInfo: getUserInfoFromStorage(),
};

const userSlicer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlicer.actions;
export default userSlicer.reducer;
