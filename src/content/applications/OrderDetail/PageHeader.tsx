import { Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function PageHeader({ selectedItemType, setSelectedItemType }) {
  const user = {
    name: 'Admin',
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Management Order
        </Typography>
      </Grid>
      <Grid item>
        <FormControl fullWidth variant="filled">
          <InputLabel id="itemTypeId-label">Item Type</InputLabel>
          <Select label="itemTypeId-label"
            value={selectedItemType}
            onChange={e => { setSelectedItemType(parseInt(e.target.value)) }}
          >
            <MenuItem value={1}>Product</MenuItem>
            <MenuItem value={2}>Service</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
