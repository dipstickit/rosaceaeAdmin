import { useState, useRef } from 'react';

import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ItemTypeService from '../../../api/Itemtype.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

function BulkActions({ selectedItems }) {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ? 
  useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)
  
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const deleteItem = (id: number) => {
    setLoading(true);
    ItemTypeService.deleteItemType(id, accessToken)
      .then(() => {
        toast.success('ItemType deleted successfully', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        });
        navigate("/management/item");
      })
      .catch((error) => {
        console.error('Error deleting itemType:', error);
        toast.error('Error deleting itemType', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDelete = (): void => {
    if (selectedItems && Array.isArray(selectedItems)) {
      selectedItems.forEach((id) => deleteItem(id));
    }
  };
  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="text.secondary">
            Bulk actions:
          </Typography>
          <ButtonError
            onClick={handleDelete}
            sx={{ ml: 1 }}
            startIcon={<DeleteTwoToneIcon />}
            variant="contained"
            disabled={loading}
          >
            Delete
          </ButtonError>
        </Box>
        <IconButton
          color="primary"
          onClick={openMenu}
          ref={moreRef}
          sx={{ ml: 2, p: 1 }}
        >
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>

      <Menu
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <List sx={{ p: 1 }} component="nav">
          <ListItem >
            <ListItemText primary="Bulk delete selected" />
          </ListItem>
          <ListItem >
            <ListItemText primary="Bulk edit selected" />
          </ListItem>
        </List>
      </Menu>
    </>
  );
}

export default BulkActions;
