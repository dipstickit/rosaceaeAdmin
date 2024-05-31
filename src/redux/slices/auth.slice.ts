import { createSlice } from '@reduxjs/toolkit';
import { FulfilledAction, PendingAction, RejectedAction } from '../../types/redux.types';
import { loginAPI, logoutAPI } from '../actions/auth.actions';
import { initialAuthState } from '../types/auth.types';

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('userToken');
      state.isLoading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAPI.fulfilled, (state, action) => {
        console.log('Login fulfilled action payload:', action.payload); 
        state.isLoading = false;
        const { access_token, userInfo } = action.payload; 
        state.userToken = access_token;
        localStorage.setItem('userToken', access_token);
        state.userInfo = userInfo;
      })
      .addCase(loginAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutAPI.fulfilled, (state) => {
        state.userInfo = null;
        state.userToken = null;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLoading = false;
        }
      );
  }
});

export const { logout, setUser, setIsLoading } = authSlice.actions;

export default authSlice.reducer;