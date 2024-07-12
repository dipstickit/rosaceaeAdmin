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
import { ResponseData } from 'src/models/Item.model';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { Link, useNavigate } from 'react-router-dom';
import ItemService from '../../../api/Item.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

interface RecentOrdersTableProps {
  className?: string;
  items: ResponseData['content'];
  role: any;
  setItems: React.Dispatch<React.SetStateAction<ResponseData['content']>>;
}


const applyFilters = (
  items: ResponseData['content']
): ResponseData['content'] => {
  return items.filter((item) => {
    let matches = true;
    return matches;
  });
};

const applyPagination = (
  items: ResponseData['content'],
  page: number,
  limit: number
): ResponseData['content'] => {
  return items.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ items, role }) => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteItem = (id: number) => {
    setLoading(true);
    ItemService.deleteItem(id, accessToken)
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
        setItems(items.filter(item => item.itemId !== id));
        setLoading(false);
        // navigate("/management/item");
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
      event.target.checked ? items.map((item) => item.itemId.toString()) : []
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
              <TableCell>Item Name</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell align="right" sx={{ textWrap: 'nowrap' }}>Item Price</TableCell>
              {role !== 'ADMIN' ? <TableCell align="right">Actions</TableCell> : null}

            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedItems.map((item) => {
              const isItemSelected = selectedItems.includes(
                item.itemId.toString()
              );
              return (
                <TableRow hover key={item.itemId} selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneItem(event, item.itemId.toString())
                      }
                      value={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.itemDescription}</TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    {numeral(item.itemPrice).format('0,0')} ₫
                  </TableCell>
                  {role !== 'ADMIN' ?
                    <TableCell align="right">
                      <Tooltip title="Edit Item" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <Link to={`/management/item/${item?.itemId}/update`}>
                            {' '}
                            <EditTwoToneIcon fontSize="small" />
                          </Link>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Item" arrow>
                        <IconButton
                          onClick={() => deleteItem(item.itemId)}
                          sx={{
                            '&:hover': { background: theme.colors.error.lighter },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell> : null}
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
function setItems(arg0: import("src/models/Item.model").Item[]) {
  throw new Error('Function not implemented.');
}

