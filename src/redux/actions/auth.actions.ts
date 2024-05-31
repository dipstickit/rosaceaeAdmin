/* eslint-disable @typescript-eslint/return-await */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginResponse, ResponseSuccessful } from '../../types/response.type';
import instance from 'src/api/axiosCustomize';
import { LoginArgs } from '../types/auth.types';
import { HttpStatusCode } from 'axios';

export const loginAPI = createAsyncThunk('auth/login', async ({ email, password }: LoginArgs, thunkAPI) => {
  try {
    const response = await instance.post<ResponseSuccessful<LoginResponse>>('auth/login', {
      email,
      password
    });

    if (response.status === HttpStatusCode.Unauthorized) {
      throw new Error("Unauthorized: Incorrect credentials");
    }

    if (!response.data || !response.data.data || !response.data.data.access_token) {
      throw new Error("Access token not found in response");
    }
    const { access_token, userInfo } = response.data.data;
    return { access_token, userInfo };
  } catch (error: any) {
    console.log("Login API Error:", error);
    if (error.response && error.response.data.error_message) {
      return thunkAPI.rejectWithValue(error.response.data.error_message);
    } else {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
});


export const logoutAPI = createAsyncThunk('auth/logout', async (token: string, thunkAPI) => {
  try {
    const response = await instance.post(`/auth/logout?token=${token}`);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
