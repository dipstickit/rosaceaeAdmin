import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC } from 'react';

interface PageHeaderProps {
  username: string
  userimage: string
}

const PageHeader: FC<PageHeaderProps> = ({ username, userimage }) => {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          alt={username}
          src={userimage}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {username}!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
