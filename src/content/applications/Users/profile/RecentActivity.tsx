import {
  Box,
  Typography,
  Card,
  CardHeader,
  Divider,
  Avatar,
  useTheme,
  styled,
} from '@mui/material';

import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import OrderDetailService from 'src/api/OrderDetail.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'src/redux/slices/auth.slice';
import jwt_decode from "jwt-decode";
import { useAppDispatch } from 'src/redux/store';
import { useNavigate } from 'react-router-dom';
import UserService from 'src/api/User.services';
import { OrderDetail, OrderDetailResponse } from 'src/models/OrderDetail.model';
import { Item } from 'src/models/Item.model';
import ItemService from 'src/api/Item.service';
import { Inventory2Outlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';


const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

function RecentActivity() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [listItem, setListItem] = useState<OrderDetail[]>([]);
  const [listProduct, setListProduct] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  const fetchItem = async () => {
    try {
      const response = await OrderDetailService.getOrderDetailByShop({}, accessToken, user.usersID);
      const response2 = await ItemService.getItemByShopId({}, accessToken, user.usersID);
      console.log('Response data:', response.data);
      if (response.data.content) {
        setListItem(response.data.content.slice().reverse());
        setListProduct(response2.data.content.slice().reverse());
      } else {
        setListItem([])
        setListProduct([])
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
      <CardHeader title="Recent Activity" />
      <Divider />
      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <ShoppingBagTwoToneIcon />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3">Orders</Typography>

          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total
              </Typography>
              <Typography variant="h2">{listItem ? listItem.length : 0}</Typography>
            </Box>
          </Box>
          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Pending
              </Typography>
              <Typography variant="h2">{listItem ? listItem.filter(x => x.status == 'PENDING').length : 0}</Typography>
            </Box>
            <Box>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Shipped
              </Typography>
              <Typography variant="h2">{listItem ? listItem.filter(x => x.status == 'Shipped').length : 0}</Typography>
            </Box>
          </Box>
          <Box pt={2} display="flex">
            <Box pr={6.5}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Delivered
              </Typography>
              <Typography variant="h2">{listItem ? listItem.filter(x => x.status == 'DELIVERED').length : 0}</Typography>
            </Box>
            <Box>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Canceled
              </Typography>
              <Typography variant="h2">{listItem ? listItem.filter(x => x.status == 'CANCELLED').length : 0}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <Inventory2Outlined />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3">Products</Typography>

          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total
              </Typography>
              <Typography variant="h2">{listProduct ? listProduct.length : 0}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <StarTwoToneIcon />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3">Reviews</Typography>

          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total
              </Typography>
              <Typography variant="h2">654</Typography>
            </Box>
            <Box>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Useful
              </Typography>
              <Typography variant="h2">21</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default RecentActivity;
