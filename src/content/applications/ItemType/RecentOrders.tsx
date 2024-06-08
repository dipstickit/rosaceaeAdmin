import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ItemTypeService from '../../../api/Itemtype.service';
import { ItemType, ItemTypesResponse } from 'src/models/ItemType.model';
import { useSelector } from 'react-redux';

const RecentOrders: React.FC = () => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ? 
  useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  const [listItem, setListItem] = useState<ItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ItemTypesResponse['content']>([]);


  const fetchItem = async () => {
    try {
      const response = await ItemTypeService.getItemType({}, accessToken);
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
