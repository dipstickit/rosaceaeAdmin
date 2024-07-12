import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Grid, Container } from '@mui/material';

import ProfileCover from './ProfileCover';
import RecentActivity from './RecentActivity';
import Feed from './Feed';
import PopularTags from './PopularTags';
import MyCards from './MyCards';
import Addresses from './Addresses';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/redux/store';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { setUser } from '../../../../redux/slices/auth.slice';
import UserService from '../../../../api/User.services';

function ManagementUserProfile() {
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
        <title>User Details - Management</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            {user !== null ?
              <ProfileCover user={user} accessToken={accessToken} />
              :
              null
            }
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          {/* <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid>
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid> */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
