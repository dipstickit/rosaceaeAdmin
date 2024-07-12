/* eslint-disable @typescript-eslint/return-await */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginResponse, ResponseSuccessful } from '../../types/response.type';
import instance from 'src/api/axiosCustomize';
import { LoginArgs } from '../types/auth.types';
import { HttpStatusCode } from 'axios';
import toast from 'react-hot-toast';

export const loginAPI = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginArgs, thunkAPI) => {
    try {
      const response = await instance.post<ResponseSuccessful<LoginResponse>>(
        'auth/login',
        {
          email,
          password
        }
      );
      console.log('Login API Response:', response.data);

      if (response.status === HttpStatusCode.Unauthorized) {
        toast.error('Unauthorized: Incorrect credentials');
        return;
      }
      if (!response.data) {
        toast.error('Access token not found in response');
        return;
      }
      const { access_token, userInfo } = response.data;
      return { access_token, userInfo };
    } catch (error: any) {
      console.log('Login API Error:', error);
      if (error.response && error.response.data.error_message) {
        return thunkAPI.rejectWithValue(error.response.data.error_message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const logoutAPI = createAsyncThunk(
  'auth/logout',
  async (token: string, thunkAPI) => {
    try {
      const response = await instance.post(`/auth/logout?token=${token}`);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
