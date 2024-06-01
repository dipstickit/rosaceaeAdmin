import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom';

function PageHeader() {
  const user = {
    name: 'Admin',
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        Management ItemType
        </Typography>
        <Typography variant="subtitle2">
          {user.name}, these are your itemtype
        </Typography>
      </Grid>
      <Grid item>
        <Link to={`/management/itemType/createItemType`} >
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create ItemType
        </Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
