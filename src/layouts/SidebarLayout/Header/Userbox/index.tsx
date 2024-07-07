import { useRef, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import { useAppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUser } from '../../../../redux/slices/auth.slice';
import UserService from '../../../../api/User.services';
import { logoutAPI } from 'src/redux/actions/auth.actions';


const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.auth.userToken) || localStorage.getItem("userToken");
  let user = useSelector((state: any) => state.auth.userInfo)
  console.log(user)
  console.log(accessToken)

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

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    navigate('/login')
  }

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user !== null ? user.accountName : 'nigga'}
          src={user !== null ? user.coverImages : 'https://i.ytimg.com/vi/dMDyVBM1Sms/maxresdefault.jpg'} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user !== null ? user.accountName : 'nigga'}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user !== null ? user.role : 'lmao'}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user !== null ? user.accountName : 'nigga'}
            src={user !== null ? user.coverImages : 'https://i.ytimg.com/vi/dMDyVBM1Sms/maxresdefault.jpg'} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user !== null ? user.accountName : 'nigga'}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user !== null ? user.role : 'lmao'}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem to="/management/profile/details" component={NavLink}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary="My Profile" />
          </ListItem>
          <ListItem to="/dashboards/messenger" component={NavLink}>
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary="Messenger" />
          </ListItem>
          <ListItem
            to="/management/profile/settings"
            component={NavLink}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary="Account Settings" />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={() => {
            handleLogout()
            console.log("logout")
          }}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
