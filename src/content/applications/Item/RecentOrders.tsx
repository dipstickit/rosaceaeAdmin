import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ItemService from '../../../api/Item.service';
import { Item, ResponseData } from 'src/models/Item.model';
import { useAppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from '../../../redux/slices/auth.slice';
import UserService from '../../../api/User.services';
import { useNavigate } from 'react-router-dom';

const RecentOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let user = useSelector((state: any) => state.auth.userInfo)
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(user)
  console.log(accessToken)

  const [listItem, setListItem] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ResponseData['content']>([]);
  const [userRole, setUserRole] = useState<string>('');

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

  const fetchItem = async () => {
    try {
      let response = null
      if (user.role === 'ADMIN') {
        response = await ItemService.getItem({}, accessToken);
      }
      else {
        response = await ItemService.getItemByShopId({}, accessToken, user.usersID);
      }
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);

      if (response.data.content) {
        setListItem(response.data.content.slice().reverse());
      } else {
        throw new Error('No content in response data.');
      }
    } catch (error) {
      setError((error as Error).message);
      console.error('Error fetching items:', (error as Error).message);
    }
  };

  useEffect(() => {
    if (user !== null) {
      setUserRole(user.role)
      fetchItem();
    }
  }, [user]);

  return (
    <Card>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <RecentOrdersTable items={listItem} setItems={setItems} role={userRole} />
      )}
    </Card>
  );
}

export default RecentOrders;
