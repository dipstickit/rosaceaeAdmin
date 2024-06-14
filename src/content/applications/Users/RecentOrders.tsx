import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import UserService from '../../../api/User.services';
import { User } from 'src/types/user.type';
import { UsersReponse } from 'src/models/UserType.model';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";
import { useAppDispatch } from 'src/redux/store';
import { setUser } from '../../../redux/slices/auth.slice';
import { useNavigate } from 'react-router-dom';

const RecentOrders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  let user = useSelector((state: any) => state.auth.userInfo)
  console.log(accessToken)
  console.log(user)

  const getUserByEmail = async () => {
    var decoded = jwt_decode(accessToken);
    console.log(decoded)
    const response = await UserService.getUserByEmail(decoded["sub"], accessToken)
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('userToken');
      navigate('/login')
      return
    }
    user = response.data['userInfo']
    console.log(user)
    dispatch(setUser(user));
  }

  if (user === null) {
    console.log("user is null")
    getUserByEmail()
  }

  const [listUser, setListUser] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<UsersReponse['content']>([]);


  const fetchItem = async () => {
    try {
      const response = await UserService.getUsers({}, accessToken);
      console.log('Response data:', response.data.content);
      if (response.data.content) {
        console.log(user.usersID)
        setListUser(response.data.content.filter(u => u.usersID != user.usersID && u.role === 'SHOP'));
      } else {
        throw new Error('No content in response data.');
      }
    } catch (error) {
      setError((error as Error).message);
      console.error('Error fetching items:', (error as Error).message);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <Card>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <RecentOrdersTable users={listUser} setItems={setItems} />
      )}
    </Card>
  );
}

export default RecentOrders;
