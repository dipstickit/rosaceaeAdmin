import { AppDispatch } from '../redux/store';
import { HttpStatusCode } from 'axios';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router';
import { loginAPI } from '../redux/actions/auth.actions';
import { setIsLoading, setUser } from '../redux/slices/auth.slice';

export const handleSubmit = async (
  email: string,
  password: string,
  dispatch: AppDispatch,
  navigate: NavigateFunction
) => {
  try {
    dispatch(setIsLoading(true));

    const resultAction = await dispatch(loginAPI({ email, password }));
    console.log('Login resultAction:', resultAction);

    if (loginAPI.fulfilled.match(resultAction)) {
      const { access_token, userInfo } = resultAction.payload;
      console.log('Login successful, access_token:', access_token);
      localStorage.setItem('userToken', access_token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('usersID', JSON.stringify(userInfo.usersID));
      console.log('Token and user info stored in localStorage');

      if (userInfo && userInfo.role === 'ADMIN') {
        toast.success('Login Successfully!');
        console.log('User is admin, navigating to dashboard...');
        dispatch(setUser(userInfo));
        navigate('/dashboards/rosaceae');
      } else if (userInfo && userInfo.role === 'SHOP') {
        toast.success('Login Successfully!');
        console.log('User is shop, navigating to dashboard...');
        dispatch(setUser(userInfo));
        navigate('/dashboards/rosaceae');
      } else {
        navigate('/login');
        toast.error('You are not authorized!');
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
      }
    } else {
      toast.error(resultAction.error.message);
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response && error.response.status === HttpStatusCode.Forbidden) {
      toast.error('Wrong Email or Password!');
    } else if (
      error.response &&
      error.response.status === HttpStatusCode.Unauthorized
    ) {
      toast.error('Invalid credentials!');
    } else {
      toast.error(error.message);
    }
  } finally {
    dispatch(setIsLoading(false));
  }
};
