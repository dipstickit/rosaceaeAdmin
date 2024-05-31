import { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ItemService from '../../../api/Item.service';
import { Item } from 'src/models/Item.model';

function RecentOrders() {
  const [listItem, setListItem] = useState<Item[]>([]);
  const fetchItem = async () => {
    try {
      const response = await ItemService.getItem({});
      console.log(response.data);
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setListItem(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <Card>
      <RecentOrdersTable items={listItem} />
    </Card>
  );
}

export default RecentOrders;
