import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import CatgoryService from '../../../api/Category.service';

import { Category, CategoryResponse } from 'src/models/Category.model';

const RecentOrders: React.FC = () => {
  const [listItem, setListItem] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CategoryResponse['content']>([]);
  const fetchItem = async () => {
    try {
      const response = await CatgoryService.getCategory({});
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
        <RecentOrdersTable items={listItem} setItems={setItems} />
      )}
    </Card>
  );
}

export default RecentOrders;
