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
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CategoryResponse } from 'src/models/Category.model';
import CatgoryService from '../../../api/Category.service';
import { useSelector } from 'react-redux';

interface RecentOrdersTableProps {
  className?: string;
  items: CategoryResponse['content'];
  setItems: React.Dispatch<React.SetStateAction<CategoryResponse['content']>>;
}

const applyFilters = (
  items: CategoryResponse['content']
): CategoryResponse['content'] => {
  return items.filter((item) => {
    let matches = true;
    return matches;
  });
};

const applyPagination = (
  items: CategoryResponse['content'],
  page: number,
  limit: number
): CategoryResponse['content'] => {
  return items.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteItem = (id: number) => {
    let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
      useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
    console.log(accessToken)

    setLoading(true);
    CatgoryService.deleteCategory(id, accessToken)
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
        setItems(items.filter(item => item.categoryId !== id))
        setLoading(false);
        navigate("/management/category");
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
      event.target.checked ? items.map((item) => item.categoryId.toString()) : []
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
              <TableCell>Category Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedItems.map((item) => {
              const isItemSelected = selectedItems.includes(
                item.categoryId.toString()
              );
              return (
                <TableRow hover key={item.categoryId} selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneItem(event, item.categoryId.toString())
                      }
                      value={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>{item.categoryName}</TableCell>
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
                        <Link to={`/management/category/${item?.categoryId}/update`}>
                          {' '}
                          <EditTwoToneIcon fontSize="small" />
                        </Link>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Item" arrow>
                      <IconButton
                        onClick={() => deleteItem(item.categoryId)}
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
function setItems(arg0: import("src/models/Category.model").Category[]) {
  throw new Error('Function not implemented.');
}

