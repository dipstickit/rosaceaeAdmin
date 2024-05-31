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

import { ResponseData } from 'src/models/Item.model';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';

interface RecentOrdersTableProps {
  className?: string;
  items: ResponseData['content'];
}


const applyFilters = (
  items: ResponseData['content'],
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

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);



  useEffect(() => {
    setSelectedItems([]);
  }, [items]);

  

  const handleSelectAllItems = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedItems(
      event.target.checked
        ? items.map((item) => item.itemId.toString())
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
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
              </FormControl>
            </Box>
          }
          title="Recent Orders"
        />
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
              <TableCell>Item ID</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell align="right">Item Price</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedItems.map((item) => {
              const isItemSelected = selectedItems.includes(item.itemId.toString());
              return (
                <TableRow
                  hover
                  key={item.itemId}
                  selected={isItemSelected}
                >
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
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.itemDescription}</TableCell>
                  <TableCell align="right">{numeral(item.itemPrice).format('$0,0.00')}</TableCell>
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
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Item" arrow>
                      <IconButton
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
  items:PropTypes.array.isRequired 
};

RecentOrdersTable.defaultProps = {
  items: []
};

export default RecentOrdersTable;
