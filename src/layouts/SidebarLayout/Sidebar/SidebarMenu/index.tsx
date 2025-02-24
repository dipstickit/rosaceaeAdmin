import { useContext, useEffect } from 'react';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';

import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import ChromeReaderModeTwoToneIcon from '@mui/icons-material/ChromeReaderModeTwoTone';
import WorkspacePremiumTwoToneIcon from '@mui/icons-material/WorkspacePremiumTwoTone';
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';
import { useSelector } from 'react-redux';
import UserService from '../../../../api/User.services';
import jwt_decode from 'jwt-decode';
import { useAppDispatch } from 'src/redux/store';
import { setUser } from '../../../../redux/slices/auth.slice';
import { BookOnline, ListAltOutlined } from '@mui/icons-material';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accessToken =
    useSelector((state: any) => state.auth.userToken) ||
    localStorage.getItem('userToken');
  let user = useSelector((state: any) => state.auth.userInfo);
  console.log(user);
  console.log(accessToken);

  useEffect(() => {
    if (user === null) {
      getUserByEmail();
    }
  }, []);

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

  return (
    <>
      <MenuWrapper>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/dashboards/rosaceae"
                  startIcon={<BrightnessLowTwoToneIcon />}
                >
                  Chart
                </Button>
              </ListItem>
              {/* <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/dashboards/messenger"
                  startIcon={<MmsTwoToneIcon />}
                >
                  Messenger
                </Button>
              </ListItem> */}
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Management
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/item"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Item
                </Button>
              </ListItem>
              {
                user !== null && user.role == 'ADMIN' ?
                  <>
                    <ListItem component="div">
                      <Button
                        disableRipple
                        component={RouterLink}
                        onClick={closeSidebar}
                        to="/management/itemType"
                        startIcon={<TableChartTwoToneIcon />}
                      >
                        ItemType
                      </Button>
                    </ListItem>
                    <ListItem component="div">
                      <Button
                        disableRipple
                        component={RouterLink}
                        onClick={closeSidebar}
                        to="/management/category"
                        startIcon={<TableChartTwoToneIcon />}
                      >
                        Category
                      </Button>
                    </ListItem>
                    <ListItem component="div">
                      <Button
                        disableRipple
                        component={RouterLink}
                        onClick={closeSidebar}
                        to="/management/user"
                        startIcon={<TableChartTwoToneIcon />}
                      >
                        User
                      </Button>
                    </ListItem>
                    <ListItem component="div">
                      <Button
                        disableRipple
                        component={RouterLink}
                        onClick={closeSidebar}
                        to="/management/shopPay"
                        startIcon={<TableChartTwoToneIcon />}
                      >
                        Payment For Shop
                      </Button>
                    </ListItem>
                  </>

                  : ""
              }
              {
                user !== null && user.role == 'SHOP' ?
                  <>
                    <ListItem component="div">
                      <Button
                        disableRipple
                        component={RouterLink}
                        onClick={closeSidebar}
                        to="/management/booking"
                        startIcon={<ListAltOutlined />}
                      >
                        Booking
                      </Button>
                    </ListItem>
                  </>
                  : ""
              }
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/order-for-shop"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Order
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Accounts
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/profile/details"
                  startIcon={<AccountCircleTwoToneIcon />}
                >
                  User Profile
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/profile/settings"
                  startIcon={<DisplaySettingsTwoToneIcon />}
                >
                  Account Settings
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        {user !== null && user.role == 'ADMIN' ? (
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Extra Pages
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/status/404"
                    startIcon={<CheckBoxTwoToneIcon />}
                  >
                    Error 404
                  </Button>
                </ListItem>
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/status/500"
                    startIcon={<CameraFrontTwoToneIcon />}
                  >
                    Error 500
                  </Button>
                </ListItem>
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/status/coming-soon"
                    startIcon={<ChromeReaderModeTwoToneIcon />}
                  >
                    Coming Soon
                  </Button>
                </ListItem>
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/status/maintenance"
                    startIcon={<WorkspacePremiumTwoToneIcon />}
                  >
                    Maintenance
                  </Button>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>
        ) : (
          ''
        )}
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
