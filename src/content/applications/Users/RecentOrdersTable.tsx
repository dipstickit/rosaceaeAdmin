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

import { User } from "src/types/user.type";
import { UsersReponse } from 'src/models/UserType.model';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { NotInterested } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BulkActions from './BulkActions';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ItemTypeService from '../../../api/Itemtype.service';
import UserServices from 'src/api/User.services';
import { useSelector } from 'react-redux';

interface RecentOrdersTableProps {
  className?: string;
  users: UsersReponse['content'];
  setItems: React.Dispatch<React.SetStateAction<UsersReponse['content']>>;

}

const applyFilters = (
  users: UsersReponse['content'],
): UsersReponse['content'] => {
  return users.filter((item) => {
    let matches = true;
    return matches;
  });
};

const applyPagination = (
  items: UsersReponse['content'],
  page: number,
  limit: number
): UsersReponse['content'] => {
  return items.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ users: users }) => {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const banUser = (id: number) => {
    setLoading(true);
    UserServices.banUser(id, accessToken)
      .then(() => {
        toast.success('Ban/Unban user successfully', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        });
        // setItems(users.filter(user => user.usersID !== id));
        setLoading(false);
        window.location.href = "/management/user"
      })
      .catch((error) => {
        console.error('Error banning user:', error);
        toast.error('Error banning item', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        });
      })
    setLoading(false);
  };

  useEffect(() => {
    setSelectedItems([]);
  }, [users]);


  const handleSelectAllItems = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedItems(
      event.target.checked
        ? users.map((user) => user.usersID.toString())
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

  const filteredItems = applyFilters(users);
  const paginatedItems = applyPagination(filteredItems, page, limit);
  const selectedSomeItems =
    selectedItems.length > 0 &&
    selectedItems.length < users.length;
  const selectedAllItems =
    selectedItems.length === users.length;
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
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedItems.map((user) => {
              const isItemSelected = selectedItems.includes(user.usersID.toString());
              return (
                <TableRow
                  hover
                  key={user.usersID}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneItem(event, user.usersID.toString())
                      }
                      value={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>{user.accountName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {
                    user.userStatus === true ? <TableCell align="right">
                      {/* <Tooltip title="Edit Item" arrow>
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
                        <Link to={`/management/itemType/${user?.usersID}/update`}>
                          {' '}
                          <EditTwoToneIcon fontSize="small" />
                        </Link>
                      </IconButton>
                    </Tooltip> */}
                      <Tooltip title="Ban User" arrow>
                        <IconButton
                          onClick={() => banUser(user.usersID)}
                          sx={{
                            '&:hover': { background: theme.colors.error.lighter },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <NotInterested fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                      :
                      <TableCell align="right">
                        {/* <Tooltip title="Edit Item" arrow>
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
    <Link to={`/management/itemType/${user?.usersID}/update`}>
      {' '}
      <EditTwoToneIcon fontSize="small" />
    </Link>
  </IconButton>
</Tooltip> */}
                        <Tooltip title="Unban User" arrow>
                          <IconButton
                            onClick={() => banUser(user.usersID)}
                            sx={{
                              '&:hover': { background: theme.colors.error.lighter },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

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
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  users: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired
};

RecentOrdersTable.defaultProps = {
  users: [],
  setItems: () => { }
};

export default RecentOrdersTable;
function setItems(arg0: import("src/types/user.type").User[]) {
  throw new Error('Function not implemented.');
}

