import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import BookingService from '../../../api/Booking.service';
import { Booking, BookingResponse } from 'src/models/Booking.model';
import { useAppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from '../../../redux/slices/auth.slice';
import UserService from '../../../api/User.services';
import { useNavigate } from 'react-router-dom';

const RecentOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let [userInfo, setUserInfo] = useState<any>(useSelector((state: any) => state.auth.userInfo))
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(userInfo)
  console.log(accessToken)

  const [listItem, setListItem] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BookingResponse['content']>([]);

  const getUserByEmail = async () => {
    var decoded = jwt_decode(accessToken);
    console.log(decoded)
    const response = await UserService.getUserByEmail(decoded["sub"], accessToken)
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('userToken');
      navigate('/login')
      return
    }
    setUserInfo(response.data['userInfo'])
    console.log(userInfo)
    dispatch(setUser(userInfo));
  }

  if (userInfo === null) {
    console.log("user is null")
    getUserByEmail()
  }

  const fetchItem = async () => {
    try {
      let response = null
      response = await BookingService.getBookingByShop({}, accessToken, userInfo.usersID);
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
    if (userInfo !== null) {
      fetchItem();
    }
  }, [userInfo]);

  return (
    <Card>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <RecentOrdersTable items={listItem} setItems={setItems} />
      )}
    </Card>
  );
}

export default RecentOrders;
