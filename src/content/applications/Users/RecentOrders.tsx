import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import UserService from '../../../api/User.services';
import { User } from 'src/types/user.type';
import { UsersReponse } from 'src/models/UserType.model';
import { useSelector } from 'react-redux';

const RecentOrders: React.FC = () => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  const [listUser, setListUser] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<UsersReponse['content']>([]);


  const fetchItem = async () => {
    try {
      const response = await UserService.getUsers({}, accessToken);
      console.log('Response data:', response.data.content);
      if (response.data.content) {
        setListUser(response.data.content);
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
