// import { Dispatch } from '@reduxjs/toolkit';
// import { HttpStatusCode } from 'axios';
// import toast from 'react-hot-toast';
// import { NavigateFunction } from 'react-router';
// import { getUserDataFromToken, login } from '../redux/actions/auth.actions';
// import { setIsLoading, setUser } from '../redux/slices/auth.slice';

// export const handleSubmit = async (email: string, password: string, dispatch: Dispatch, navigate: NavigateFunction) => {
//   try {
//     dispatch(setIsLoading(true));
//     const response = await login(email, password);
//     const token = response.data.data.access_token;
//     localStorage.setItem('token', token);
//     const user = await getUserDataFromToken();

//     if (user && user.role === 'ADMIN') {
//       toast.success('Login Successfully!');
//       dispatch(setUser(user));
//       navigate('/dashboards/rosaceae')
//     } else {
//       toast.error('You are not ADMIN!');
//       localStorage.setItem('token', '');
//       localStorage.setItem('user', '');
//     }
//   } catch (error) {
//     if (error.response && error.response.status === HttpStatusCode.Forbidden) {
//       toast.error('Wrong Email or Password!');
//     } else {
//       toast.error(error.message);
//     }
//   } finally {
//     dispatch(setIsLoading(false));
//   }
// };

import { Dispatch } from '@reduxjs/toolkit';
import { HttpStatusCode } from 'axios';
import toast from 'react-hot-toast';
import { login } from '../redux/actions/auth.actions';
import { setIsLoading, setUser } from '../redux/slices/auth.slice';

export const handleSubmit = async (email: string, password: string, dispatch: Dispatch) => {
  try {
    dispatch(setIsLoading(true));
    console.log("Starting login process..."); 
    const response = await login(email, password);
    console.log("Login response received:", response); 
    const { access_token, userInfo } = response.data.data;
    localStorage.setItem('token', access_token);
    if (userInfo && userInfo.role === 'ADMIN') {
      toast.success('Login Successfully!');
      console.log("User is admin, navigating to dashboard..."); 
      dispatch(setUser(userInfo));
    } else {
      toast.error('You are not ADMIN!');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (error) {
    if (error.response && error.response.status === HttpStatusCode.Forbidden) {
      toast.error('Wrong Email or Password!');
    } else {
      toast.error(error.message);
    }
  } finally {
    dispatch(setIsLoading(false));
    console.log("Finished login process.");
  }
};
