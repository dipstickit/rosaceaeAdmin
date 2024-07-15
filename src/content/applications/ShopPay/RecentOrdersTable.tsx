import { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  useTheme
} from '@mui/material';
import { ShopPayType } from 'src/models/ShopPayType.model';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import ShopPayService from '../../../api/ShopPay.service';
import { toast } from 'react-toastify';

interface RecentOrdersTableProps {
  className?: string;
  users: ShopPayType[];
  setItems: React.Dispatch<React.SetStateAction<ShopPayType[]>>;
}

const applyFilters = (users: ShopPayType[]): ShopPayType[] => {
  return users.filter((item) => {
    let matches = true;
    return matches;
  });
};

const applyPagination = (
  items: ShopPayType[],
  page: number,
  limit: number
): ShopPayType[] => {
  return items.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({
  users: users,
  setItems
}) => {
  let accessToken: string =
    useSelector((state: any) => state.auth.userToken) !== null
      ? useSelector((state: any) => state.auth.userToken)
      : localStorage.getItem('userToken');
  console.log(accessToken);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setSelectedItems([]);
  }, [users]);

  const handleSelectAllItems = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedItems(
      event.target.checked ? users.map((user) => user.userId.toString()) : []
    );
  };

  const handleSelectOneItem = (
    event: ChangeEvent<HTMLInputElement>,
    itemId: string
  ): void => {
    if (!selectedItems.includes(itemId)) {
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== itemId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleOpenDialog = (shopPayId: number) => {
    setSelectedUserId(shopPayId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmPayment = async () => {
    if (selectedUserId !== null) {
      setLoading(true);
      setTimeout(async () => {
        try {
          await ShopPayService.confirmPayment(selectedUserId, accessToken);
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.shopPayId === selectedUserId
                ? { ...item, status: true }
                : item
            )
          );
          toast.success('Payment confirmation successful');
          setSnackbarSeverity('success');
        } catch (error) {
          console.error('Error confirming payment:', error);
          const errorMessage =
            error.response?.data?.message || 'An error occurred';
          toast.error(errorMessage);
          setSnackbarSeverity('error');
        } finally {
          setSnackbarOpen(true);
          handleCloseDialog();
          setLoading(false);
        }
      }, 1000);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const filteredItems = applyFilters(users);
  const paginatedItems = applyPagination(filteredItems, page, limit);
  const selectedSomeItems =
    selectedItems.length > 0 && selectedItems.length < users.length;
  const selectedAllItems = selectedItems.length === users.length;
  const theme = useTheme();

  return (
    <Card>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllItems}
                  indeterminate={selectedSomeItems}
                  onChange={handleSelectAllItems}
                />
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Account Name</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>Bank Account Number</TableCell>
              <TableCell>Money</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedItems.map((user) => {
              const isItemSelected = selectedItems.includes(
                user.userId.toString()
              );
              return (
                <TableRow hover key={user.userId} selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneItem(event, user.userId.toString())
                      }
                      value={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.accountName}</TableCell>
                  <TableCell>{user.bankName}</TableCell>
                  <TableCell>{user.bankAccountNumber}</TableCell>
                  <TableCell>{numeral(user.money).format('0,0')}</TableCell>
                  <TableCell>{user.status ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    {user.status ? (
                      'Confirmed'
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(user.shopPayId)}
                      >
                        Confirm Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredItems.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to confirm the payment for this user?
          </DialogContentText>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            color="primary"
            autoFocus
            disabled={loading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  users: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired
};

RecentOrdersTable.defaultProps = {
  users: [],
  setItems: () => {}
};

export default RecentOrdersTable;
