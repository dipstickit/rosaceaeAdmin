import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import OrderDetailService from '../../../api/OrderDetail.service';
import UserService from 'src/api/User.services';
import { OrderDetail, OrderDetailResponse } from 'src/models/OrderDetail.model';
import { useSelector, useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { useAppDispatch } from 'src/redux/store';
import { setUser } from '../../../redux/slices/auth.slice';
import { useNavigate } from 'react-router-dom';

interface RecentOrdersProps {
  selectedItemType: number
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ selectedItemType }) => {
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

  const [listItem, setListItem] = useState<OrderDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<OrderDetailResponse['content']>([]);


  const fetchItem = async () => {
    try {
      const response = await OrderDetailService.getOrderDetailByShop({}, accessToken, user.usersID);
      console.log('Response data:', response.data);
      if (response.data.content) {
        setListItem(response.data.content.slice().reverse());
      } else {
        setListItem([])
        console.log('No content in response data.');
      }
    } catch (error) {
      setError((error as Error).message);
      console.error('Error fetching items:', (error as Error).message);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [user]);

  return (
    <Card>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <RecentOrdersTable selectedItemType={selectedItemType} items={listItem} setItems={setItems} />
      )}
    </Card>
  );
}

export default RecentOrders;
