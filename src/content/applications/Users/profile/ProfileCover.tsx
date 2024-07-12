import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  Tooltip,
  Avatar,
  CardMedia,
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserServices from 'src/api/User.services';
import { User } from 'src/types/user.type';

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

const ProfileCover = ({ user, accessToken }) => {
  const [userInfo, setUserInfo] = useState<User>(user)
  const [data, setData] = useState<any>({
    shopId: user.usersID,
    coverImage: null
  })
  useEffect(() => {
    const changeImage = async () => {
      console.log(data)
      const formData = new FormData();
      formData.append('shopId', data.shopId)
      formData.append('coverImage', data.coverImage)

      const res = await UserServices.changeCoverImage(formData, accessToken)
      console.log(res.data)
      setUserInfo({
        ...userInfo,
        coverImages: res.data.userInfo.coverImages
      })
      window.location.href = "/management/profile/details"
    }
    if (data.coverImage !== null) {
      changeImage()
    }

  }, [data])
  return (
    <>
      <Box display="flex" mb={3}>
        <Tooltip arrow placement="top" title="Go back">
          <IconButton color="primary" sx={{ p: 2, mr: 2 }}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            Profile for {userInfo.accountName}
          </Typography>
          <Typography variant="subtitle2">
            This is a profile page. Easy to modify, always blazing fast
          </Typography>
        </Box>
      </Box>
      <CardCover>
        <CardMedia image={userInfo.coverImages} style={{ backgroundSize: 'contain', backgroundPosition: 'center' }} />
        <CardCoverAction>
          <Input accept="image/*" id="change-cover" multiple type="file" onChange={e => setData({
            ...data,
            coverImage: e.target.files[0]
          })} />
          <label htmlFor="change-cover">
            <Button
              startIcon={<UploadTwoToneIcon />}
              variant="contained"
              component="span"
            >
              Change cover
            </Button>
          </label>
        </CardCoverAction>
      </CardCover>
      {/* <AvatarWrapper>
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <ButtonUploadWrapper>
          <Input
            accept="image/*"
            id="icon-button-file"
            name="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton component="span" color="primary">
              <UploadTwoToneIcon />
            </IconButton>
          </label>
        </ButtonUploadWrapper>
      </AvatarWrapper> */}
      <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          {user.accountName}
        </Typography>
        {/* <Typography variant="subtitle2">{user.description}</Typography> */}
        <Typography variant="subtitle2" color="text.primary">
          Username: {user.accountName}
        </Typography>
        <Typography variant="subtitle2" color="text.primary">
          Email: {user.email}
        </Typography>
        <Typography variant="subtitle2" color="text.primary">
          Address: {user.address}
        </Typography>
        {/* <Typography variant="subtitle2" color="text.primary">
          Google Map Location: <a href={user.locationUrl}>{user.locationUrl}</a>
        </Typography> */}
        <Box
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            {/* <Button size="small" variant="contained">
              Follow
            </Button> */}
            <Button size="small" variant="outlined">
              <a href={user.locationUrl}>View Google Map Location</a>
            </Button>
          </Box>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            size="small"
            variant="text"
            endIcon={<ArrowForwardTwoToneIcon />}
          >
            {/* See all {user.followers} connections */}
          </Button>
        </Box>
      </Box>
    </>
  );
};

ProfileCover.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default ProfileCover;
