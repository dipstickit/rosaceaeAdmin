import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ItemService from '../../../api/Item.service';
import { Item, ResponseData } from 'src/models/Item.model';

const RecentOrders: React.FC = () => {
  const [listItem, setListItem] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = async () => {
    try {
      const response = await ItemService.getItem({});
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);

      

      if (response.data.content) {
        setListItem(response.data.content);
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
        <RecentOrdersTable items={listItem} />
      )}
    </Card>
  );
}

export default RecentOrders;
