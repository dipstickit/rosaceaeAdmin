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

import { OrderDetailResponse } from 'src/models/OrderDetail.model';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ItemTypeService from '../../../api/Itemtype.service';
import { useSelector } from 'react-redux';

interface RecentOrdersTableProps {
  className?: string;
  items: OrderDetailResponse['content'];
  setItems: React.Dispatch<React.SetStateAction<OrderDetailResponse['content']>>;
  selectedItemType: number
}

const applyFilters = (
  orderDetails: OrderDetailResponse['content'],
): OrderDetailResponse['content'] => {
  return orderDetails.filter((item) => {
    let matches = true;
    return matches;
  });
};

const applyPagination = (
  items: OrderDetailResponse['content'],
  page: number,
  limit: number
): OrderDetailResponse['content'] => {
  return items.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ items, selectedItemType }) => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteItemType = (id: number) => {
    // setLoading(true);
    // ItemTypeService.deleteItemType(id, accessToken)
    //   .then(() => {
    //     toast.success('Item deleted successfully', {
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       draggable: true,
    //       progress: undefined,
    //       theme: 'dark'
    //     });
    //     setItems(items.filter(item => item.itemTypeId !== id));
    //     setLoading(false);
    //     navigate("/management/item");
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting item:', error);
    //     toast.error('Error deleting item', {
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       draggable: true,
    //       progress: undefined,
    //       theme: 'dark'
    //     });
    //   })
    // setLoading(false);
  };

  useEffect(() => {
    setSelectedItems([]);
    console.log("==================================================")
    console.log(selectedItemType)
    console.log("==================================================")
  }, [items, selectedItemType]);

  const handleSelectAllItems = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedItems(
      event.target.checked
        ? items.map((item) => item.orderDetailId.toString())
        : []
    );
  };

  const handleSelectOneItem = (
    event: ChangeEvent<HTMLInputElement>,
    itemId: string
  ): void => {
    if (!selectedItems.includes(itemId)) {
      setSelectedItems((prevSelected) => [
        ...prevSelected,
        itemId
      ]);
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
    selectedItems.length > 0 &&
    selectedItems.length < items.length;
  const selectedAllItems =
    selectedItems.length === items.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions selectedItems={undefined} />
        </Box>
      )}
      <Divider />
      {
        paginatedItems !== null && paginatedItems.filter(x => x.itemTypeId === selectedItemType).length <= 0 ?
          <div>There no order</div> :
          <>
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
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Order By</TableCell>
                    <TableCell>Order Status</TableCell>
                    {
                      selectedItemType === 1 ? <TableCell align="right">Actions</TableCell> : null
                    }

                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedItems.filter(x => x.itemTypeId === selectedItemType).map((orderDetail) => {
                    const isItemSelected = selectedItems.includes(orderDetail.orderDetailId.toString());
                    return (
                      <TableRow
                        hover
                        key={orderDetail.orderDetailId}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleSelectOneItem(event, orderDetail.orderDetailId.toString())
                            }
                            value={isItemSelected}
                          />
                        </TableCell>
                        <TableCell>{orderDetail.itemName}</TableCell>
                        <TableCell>{orderDetail.quantity}</TableCell>
                        <TableCell>{orderDetail.price}</TableCell>
                        <TableCell>{orderDetail.customerName}</TableCell>
                        <TableCell style={orderDetail.status.toLowerCase() === 'pending' ? { color: 'gray' } : orderDetail.status.toLowerCase() === 'canceled' ? { color: 'red' } : { color: 'green' }} >{orderDetail.status}</TableCell>
                        {
                          selectedItemType === 1 ? <TableCell align="right">
                            <Tooltip title="Accept Order" arrow>
                              <IconButton
                                onClick={() => console.log("approve")}
                                sx={{
                                  '&:hover': {
                                    background: theme.colors.primary.lighter
                                  },
                                  color: theme.palette.primary.main
                                }}
                                color="inherit"
                                size="small"
                              >
                                ✔
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline Order" arrow>
                              <IconButton
                                onClick={() => console.log("decline")}
                                sx={{
                                  '&:hover': { background: theme.colors.error.lighter },
                                  color: theme.palette.error.main
                                }}
                                color="inherit"
                                size="small"
                              >
                                ❌
                              </IconButton>
                            </Tooltip>
                          </TableCell> :
                            null
                        }
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
          </>
      }


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
function setItems(arg0: import("src/models/ItemType.model").ItemType[]) {
  throw new Error('Function not implemented.');
}

