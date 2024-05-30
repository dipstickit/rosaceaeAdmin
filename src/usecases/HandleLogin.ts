import { Dispatch } from '@reduxjs/toolkit';
import { HttpStatusCode } from 'axios';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router';
import { getUserDataFromToken, login } from '../redux/actions/auth.actions';
import { setIsLoading, setUser } from '../redux/slices/auth.slice';

export const handleSubmit = async (email: string, password: string, dispatch: Dispatch, navigate: NavigateFunction) => {
  try {
    dispatch(setIsLoading(true));
    const response = await login(email, password);
    const token = response.data.data.access_token;
    localStorage.setItem('token', token);
    const user = await getUserDataFromToken();
    
    if (user && user.role === 'ADMIN') {
      toast.success('Login Successfully!');
      dispatch(setUser(user));
      navigate("/dashboards/rosaceae")
    } else {
      toast.error('You are not ADMIN!');
      localStorage.setItem('token', '');
      localStorage.setItem('user', '');
    }
  } catch (error) {
    if (error.response && error.response.status === HttpStatusCode.Forbidden) {
      toast.error('Wrong Email or Password!');
    } else {
      toast.error(error.message);
    }
  } finally {
    dispatch(setIsLoading(false));
  }
};
