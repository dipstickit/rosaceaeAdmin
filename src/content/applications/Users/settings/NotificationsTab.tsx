import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  Alert,
  CircularProgress,
  TextField,
  MenuItem
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BankServices from 'src/api/BankServices';
import { Formik, Form, Field } from 'formik';
import CustomErrorMessage from 'src/components/CustomErrormessage';

function ManageBank() {
  const initialValues = {
    bankName: '',
    bankAccountNumber: ''
  };

  const validationSchema = Yup.object({
    bankName: Yup.string().required('Bank Name is required'),
    bankAccountNumber: Yup.string()
      .required('Bank Account Number is required')
      .matches(/^[0-9]{10,11}$/, 'Invalid account number')
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const bankData = await BankServices.getBanks();
        setBanks(bankData);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };
    fetchBanks();
  }, []);

  const handleSubmit = async (formValue) => {
    setLoading(true);
    setServerError(null);

    const token = localStorage.getItem('userToken');
    const shopId = localStorage.getItem('usersID'); // Assuming shopId is stored as a string in localStorage

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

    const data = {
      bankName: formValue.bankName,
      bankAccountNumber: formValue.bankAccountNumber
    };

    try {
      const res = await BankServices.createBank(Number(shopId), data, token);
      console.log(res);
      toast.success('Bank Info Created Successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      window.location.href = '/management/profile/settings';
    } catch (error: any) {
      if (error.response) {
        setServerError(
          error.response.data?.error ||
            error.message ||
            'An unexpected error occurred'
        );
      } else {
        setServerError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewBankAccounts = () => {
    navigate('/management/profile/bank-accounts');
  };

  const isFieldError = (field: any) => {
    return (
      field.value !== undefined &&
      field.value !== null &&
      field.value !== '' &&
      typeof field.value === 'string' &&
      !field.value.trim()
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Bank Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to your bank details
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <Card>
                  <CardContent>
                    {serverError && (
                      <Box mb={2}>
                        <Alert severity="error">{serverError}</Alert>
                      </Box>
                    )}
                    <Box
                      display="grid"
                      gap={2}
                      gridTemplateColumns="repeat(1, 1fr)"
                    >
                      <Field name="bankName">
                        {({ field }) => (
                          <TextField
                            select
                            label="Bank Name"
                            fullWidth
                            variant="outlined"
                            {...field}
                            error={isFieldError(field)}
                            helperText={<CustomErrorMessage name="bankName" />}
                          >
                            {banks.map((bank) => (
                              <MenuItem key={bank.code} value={bank.code}>
                                <Box display="flex" alignItems="center">
                                  <img
                                    src={bank.logo}
                                    alt={bank.shortName}
                                    style={{
                                      width: '60px',
                                      marginRight: '8px'
                                    }}
                                  />
                                  {bank.shortName}
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      </Field>
                      <Field name="bankAccountNumber">
                        {({ field }) => (
                          <TextField
                            label="Bank Account Number"
                            fullWidth
                            variant="outlined"
                            {...field}
                            error={isFieldError(field)}
                            helperText={
                              <CustomErrorMessage name="bankAccountNumber" />
                            }
                          />
                        )}
                      </Field>
                    </Box>
                    <Box mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                          loading ? (
                            <CircularProgress size="1rem" />
                          ) : (
                            <EditTwoToneIcon />
                          )
                        }
                        disabled={isSubmitting || loading}
                      >
                        Create
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={handleViewBankAccounts}
                        sx={{ ml: 2 }}
                      >
                        View Bank Accounts
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ManageBank;
