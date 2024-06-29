import { FC, ChangeEvent, useState, useEffect } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  CardHeader
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { Booking, BookingResponse } from 'src/models/Booking.model';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { Link, useNavigate } from 'react-router-dom';
import BookingService from '../../../api/Booking.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { CancelOutlined, CheckBoxRounded, CheckCircleOutline, HorizontalRuleOutlined, RadioButtonUncheckedRounded } from '@mui/icons-material';

interface RecentOrdersTableProps {
  className?: string;
  items: BookingResponse['content'];
  setItems: React.Dispatch<React.SetStateAction<BookingResponse['content']>>;
}


const applyFilters = (
  items: BookingResponse['content']
): BookingResponse['content'] => {
  return items.filter((item) => {
    let matches = true;
    return matches;
  });
};

const applyPagination = (
  items: BookingResponse['content'],
  page: number,
  limit: number
): BookingResponse['content'] => {
  return items.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ items }) => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateBooking = (id: number, status: string) => {
    setLoading(true);
    const data = {
      bookingId: id,
      status: status
    }
    BookingService.updateBookingStatus(accessToken, data)
      .then(() => {
        toast.success('Item deleted successfully', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        });
        setLoading(false);
        window.location.href = '/management/booking'
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      })
    setLoading(false);
  };

  useEffect(() => {
    setSelectedItems([]);
  }, [items]);

  const handleSelectAllItems = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedItems(
      event.target.checked ? items.map((item) => item.bookingId.toString()) : []
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

  const filteredItems = applyFilters(items);
  const paginatedItems = applyPagination(filteredItems, page, limit);
  const selectedSomeItems =
    selectedItems.length > 0 && selectedItems.length < items.length;
  const selectedAllItems = selectedItems.length === items.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions selectedItems={undefined} />
        </Box>
      )}
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
              <TableCell>Service Name</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Booking Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedItems.map((item) => {
              const isItemSelected = selectedItems.includes(
                item.bookingId.toString()
              );
              return (
                <TableRow hover key={item.bookingId} selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneItem(event, item.bookingId.toString())
                      }
                      value={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>{item.serviceName}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.bookingDate}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell align="right">
                    {item.status == 'PENDING' ?
                      <>
                        <Tooltip title="Accept" arrow>
                          <IconButton
                            onClick={() => updateBooking(item.bookingId, 'CONFIRMED')}
                            sx={{
                              '&:hover': { background: theme.colors.primary.lighter },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <CheckCircleOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel" arrow>
                          <IconButton
                            onClick={() => updateBooking(item.bookingId, 'CANCELLED')}
                            sx={{
                              '&:hover': { background: theme.colors.error.lighter },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <CancelOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                      :
                      <Tooltip title="No action" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.colors.primary.lighter },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <HorizontalRuleOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }

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
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired
};

RecentOrdersTable.defaultProps = {
  items: [],
  setItems: () => { }
};

export default RecentOrdersTable;
function setItems(arg0: import("src/models/Booking.model").Booking[]) {
  throw new Error('Function not implemented.');
}

