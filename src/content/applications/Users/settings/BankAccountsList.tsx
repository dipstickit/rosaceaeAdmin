import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BankServices from 'src/api/BankServices';
import { useNavigate } from 'react-router-dom';

function BankAccountsList() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankAccounts = async () => {
      const token = localStorage.getItem('userToken');
      const shopId = localStorage.getItem('usersID');

      if (!token) {
        toast.error('No token found');
        setLoading(false);
        return;
      }

      if (!shopId) {
        toast.error('No shop ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await BankServices.getBankAccounts(
          Number(shopId),
          token
        );
        setBankAccounts(response);
      } catch (err) {
        console.error('Error fetching bank accounts:', err);
        setError('Failed to load bank accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  const handleEdit = (item: any) => {
    console.log(item.userBankId);
    navigate(`/management/profile/bank-accounts/edit/${item.userBankId}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Bank Accounts
            </Typography>
          </Box>
          <Divider />
          <CardContent>
            <List>
              {bankAccounts.map((account, index) => (
                <ListItem
                  key={index}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <ListItemText
                    primary={`Account Number: ${account.bankAccountNumber}`}
                    secondary={`Bank Name: ${account.bankName}`}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(account)}
                  >
                    Edit
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default BankAccountsList;
