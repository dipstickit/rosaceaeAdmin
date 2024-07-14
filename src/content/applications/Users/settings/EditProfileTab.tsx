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
  TextField
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from 'src/components/Text';
import Label from 'src/components/Label';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserServices from 'src/api/User.services';
import { Formik, Form, Field } from 'formik';
import CustomErrorMessage from 'src/components/CustomErrormessage';

function EditProfileTab({ user, accessToken }) {
  const initialValues = {
    name: user.accountName,
    phone: user.phone,
    address: user.address
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    // email: Yup.string().email("Please enter a valid email").required("This field is required"),
    phone: Yup.string()
      .required('This field is required')
      .matches(/^[0-9]{10,11}$/, 'Invalid phone number'),
    address: Yup.string().required("This field is required")
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (formValue) => {
    console.log(formValue);
    setLoading(true);
    setServerError(null);
    const data = {
      usersID: user.usersID,
      accountName: formValue.name,
      phone: formValue.phone,
      address: formValue.address
    }

    try {
      const res = await UserServices.updateProfile(data, accessToken);
      console.log(res);
      toast.success('Create New Shop Successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      window.location.href = "/management/profile/settings"
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.status === "User Not Found") {
        setServerError("User not found. Please check your credentials.");
      } else {
        setServerError(error.response?.data?.error || error.message || "An unexpected error occurred");
      }
    }
    finally {
      setLoading(false);
    }
  };
  const isFieldError = (field: any) => {
    return field.value !== undefined && field.value !== null && field.value !== '' && typeof field.value === 'string' && !field.value.trim();
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
                Personal Details
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your personal details
              </Typography>
            </Box>
          </Box>
          <Divider />
          {/* <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>Craig Donin</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Date of birth:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>15 March 1977</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Address:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                    <Text color="black">
                      1749 High Meadow Lane, SEQUOIA NATIONAL PARK, California,
                      93262
                    </Text>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent> */}
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
                    <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
                      <Field name="name">
                        {({ field }) => (
                          <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            {...field}
                            error={isFieldError(field)}
                            helperText={<CustomErrorMessage name="name" />}
                          />
                        )}
                      </Field>
                      <Field name="phone">
                        {({ field }) => (
                          <TextField
                            label="Phone"
                            fullWidth
                            variant="outlined"
                            {...field}
                            error={isFieldError(field)}
                            helperText={<CustomErrorMessage name="phone" />}
                          />
                        )}
                      </Field>
                      <Field name="address">
                        {({ field }) => (
                          <TextField
                            label="Address"
                            fullWidth
                            variant="outlined"
                            {...field}
                            error={isFieldError(field)}
                            helperText={<CustomErrorMessage name="address" />}
                          />
                        )}
                      </Field>
                    </Box>
                    <Box mt={2}>
                      <Button
                        type='submit'
                        variant="contained"
                        startIcon={loading ? <CircularProgress size="1rem" /> : <EditTwoToneIcon />}
                        disabled={isSubmitting || loading}
                      >
                        Edit
                      </Button>
                    </Box>

                  </CardContent>
                </Card>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
      {/* <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Account Settings
              </Typography>
              <Typography variant="subtitle2">
                Manage details related to your account
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Language:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>English (US)</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Timezone:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>GMT +2</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Account status:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Label color="success">
                    <DoneTwoToneIcon fontSize="small" />
                    <b>Active</b>
                  </Label>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
                Email Addresses
              </Typography>
              <Typography variant="subtitle2">
                Manage details related to your associated email addresses
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Email ID:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>example@demo.com</b>
                  </Text>
                  <Box pl={1} component="span">
                    <Label color="success">Primary</Label>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Email ID:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>demo@example.com</b>
                  </Text>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  );
}

export default EditProfileTab;
function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function setServerError(arg0: null) {
  throw new Error('Function not implemented.');
}

