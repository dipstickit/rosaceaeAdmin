import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  CircularProgress,
  TextField,
  MenuItem
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BankServices from 'src/api/BankServices';
import { toast } from 'react-toastify';

function EditBankAccount() {
  const { bankId } = useParams();
  const [bankAccount, setBankAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banks, setBanks] = useState([]);
  const [formValues, setFormValues] = useState({
    bankName: '',
    bankAccountNumber: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankAccount = async () => {
      const token = localStorage.getItem('userToken');
      const shopId = localStorage.getItem('usersID');

      if (!token || !shopId) {
        toast.error('Missing token or shop ID');
        setLoading(false);
        return;
      }

      try {
        const response = await BankServices.getBankAccounts(
          Number(shopId),
          token
        );
        const account = response.find(
          (account) => account.userBankId === Number(bankId)
        );
        if (account) {
          setBankAccount(account);
          setFormValues({
            bankName: account.bankName,
            bankAccountNumber: account.bankAccountNumber
          });
        } else {
          toast.error('Bank account not found');
        }
      } catch (error) {
        toast.error('Failed to load bank account details');
        console.error('Error fetching bank account:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        const bankData = await BankServices.getBanks();
        setBanks(bankData);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    fetchBankAccount();
    fetchBanks();
  }, [bankId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      toast.error('Missing token');
      return;
    }

    try {
      await BankServices.updateBankAccount(Number(bankId), formValues, token);
      toast.success('Bank account updated successfully');
      navigate('/management/profile/bank-accounts');
    } catch (error) {
      toast.error('Failed to update bank account');
      console.error('Error updating bank account:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!bankAccount) {
    return <Typography color="error">Bank account not found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Edit Bank Account
            </Typography>
          </Box>
          <Divider />
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                select
                label="Bank Name"
                name="bankName"
                value={formValues.bankName}
                onChange={handleChange}
                fullWidth
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.code} value={bank.shortName}>
                    <Box display="flex" alignItems="center">
                      <img
                        src={bank.logo}
                        alt={bank.shortName}
                        style={{
                          width: '60px',
                          marginRight: '16px'
                        }}
                      />
                      {bank.shortName}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Bank Account Number"
                name="bankAccountNumber"
                value={formValues.bankAccountNumber}
                onChange={handleChange}
                fullWidth
              />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/management/profile/bank-accounts')}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default EditBankAccount;
