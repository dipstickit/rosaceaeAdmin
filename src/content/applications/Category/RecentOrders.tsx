import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import CatgoryService from '../../../api/Category.service';

import { Category, CategoryResponse } from 'src/models/Category.model';
import { useSelector } from 'react-redux';

const RecentOrders: React.FC = () => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ? 
  useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  let user = useSelector((state: any) => state.auth.userInfo)
  console.log(user)
  console.log(accessToken)
   
  const [listItem, setListItem] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CategoryResponse['content']>([]);
  const fetchItem = async () => {
    try {
      const response = await CatgoryService.getCategory({}, accessToken);
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
    fetchItem();
  }, []);

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
