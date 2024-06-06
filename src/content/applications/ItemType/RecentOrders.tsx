import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ItemTypeService from '../../../api/Itemtype.service';
import { ItemType, ItemTypesResponse } from 'src/models/ItemType.model';

const RecentOrders: React.FC = () => {
  const [listItem, setListItem] = useState<ItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ItemTypesResponse['content']>([]);


  const fetchItem = async () => {
    try {
      const response = await ItemTypeService.getItemType({});
      console.log('Response data:', response.data.content);
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
        <RecentOrdersTable items={listItem} setItems={setItems}/>
      )}
    </Card>
  );
}

export default RecentOrders;
