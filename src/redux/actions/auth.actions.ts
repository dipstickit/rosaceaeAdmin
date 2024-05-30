/* eslint-disable @typescript-eslint/return-await */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginResponse, ResponseSuccessful } from '../../types/response.type';
import instance from 'src/api/axiosCustomize';
import { UserToken } from 'src/types/user.type';

export const loginAPI = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await instance.post<ResponseSuccessful<LoginResponse>>('/auth/login', {
      email: user,
      password: user
    });
    return response.data.data.access_token;
  } catch (error) {
    if (error.response && error.response.data.error_message) {
      return thunkAPI.rejectWithValue(error.response.data.error_message);
    } else {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
});

export const login = async (email: string, password: string) => {
  return await instance.post<ResponseSuccessful<LoginResponse>>('/auth/login', {
    email: email,
    password: password
  });
};

export const getUserDataFromToken = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await instance.post<ResponseSuccessful<UserToken>>('/auth/getUser', { access_token: token })
      const data = res.data.data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (error) {
      console.log(error)
    }
  }
  return null
}

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
