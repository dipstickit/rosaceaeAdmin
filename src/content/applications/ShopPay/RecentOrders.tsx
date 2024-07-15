import React, { useState, useEffect } from 'react';
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Typography,
  Container
} from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ShopPayService from '../../../api/ShopPay.service';
import UserService from '../../../api/User.services';
import { ShopPayType } from 'src/models/ShopPayType.model';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { useAppDispatch } from 'src/redux/store';
import { setUser } from '../../../redux/slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const RecentOrders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let accessToken: string =
    useSelector((state: any) => state.auth.userToken) !== null
      ? useSelector((state: any) => state.auth.userToken)
      : localStorage.getItem('userToken');
  let user = useSelector((state: any) => state.auth.userInfo);
  console.log(accessToken);
  console.log(user);

  const getUserByEmail = async () => {
    var decoded = jwt_decode(accessToken);
    console.log(decoded);
    const response = await UserService.getUserByEmail(
      decoded['sub'],
      accessToken
    );
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('userToken');
      navigate('/login');
      return;
    }
    user = response.data['userInfo'];
    console.log(user);
    dispatch(setUser(user));
  };

  if (user === null) {
    console.log('user is null');
    getUserByEmail();
  }

  const [listUser, setListUser] = useState<ShopPayType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ShopPayType[]>([]);
  const [month, setMonth] = useState<number>(7);

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setMonth(event.target.value as number);
  };

  const fetchItem = async () => {
    const defaultParams = { month: month, year: 2024, page: 0, int: 10 };
    try {
      const response = await ShopPayService.getShopPay(
        defaultParams,
        accessToken
      );
      console.log('Response data:', response.data.content);
      if (response.data.content) {
        setListUser(
          response.data.content
            .filter((u) => u.userId != user.userId)
            .slice()
            .reverse()
        );
      } else {
        setListUser([]);
      }
    } catch (error) {
      setError((error as Error).message);
      console.error('Error fetching items:', (error as Error).message);
      setListUser([]);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [month]);

  return (
    <Card>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={month}
            label="Month"
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {error ? (
        <Typography variant="h6" align="center" color="error">
          Error: {error}
        </Typography>
      ) : listUser.length === 0 ? (
        <Container sx={{ textAlign: 'center', py: 5 }}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 40, color: 'grey.500' }} />
          <Typography variant="h6" color="textSecondary">
            Không có dữ liệu
          </Typography>
        </Container>
      ) : (
        <RecentOrdersTable users={listUser} setItems={setItems} />
      )}
    </Card>
  );
};

export default RecentOrders;
