import { useState, ChangeEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';

import ActivityTab from './ActivityTab';
import EditProfileTab from './EditProfileTab';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from 'src/redux/slices/auth.slice';
import { useAppDispatch } from 'src/redux/store';
import jwt_decode from "jwt-decode";
import UserService from '../../../../api/User.services';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserSettings() {
  const [currentTab, setCurrentTab] = useState<string>('edit_profile');

  const tabs = [
    // { value: 'activity', label: 'Activity' },
    { value: 'edit_profile', label: 'Edit Profile' },
    // { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let user = useSelector((state: any) => state.auth.userInfo)
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
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

  return (
    <>
      <Helmet>
        <title>User Settings - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      {
        user !== null ?
          <Container maxWidth="lg">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <TabsWrapper
                  onChange={handleTabsChange}
                  value={currentTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </TabsWrapper>
              </Grid>
              <Grid item xs={12}>
                {/* {currentTab === 'activity' && <ActivityTab />} */}
                {currentTab === 'edit_profile' && <EditProfileTab user={user} accessToken={accessToken} />}
                {/* {currentTab === 'notifications' && <NotificationsTab />} */}
                {currentTab === 'security' && <SecurityTab user={user} accessToken={accessToken} />}
              </Grid>
            </Grid>
          </Container>
          : null
      }

      <Footer />
    </>
  );
}

export default ManagementUserSettings;
