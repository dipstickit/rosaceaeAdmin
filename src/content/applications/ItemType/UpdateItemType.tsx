import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import ItemTypeService from '../../../api/Itemtype.service';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import CustomErrorMessage from '../../../components/CustomErrormessage';
import { AxiosResponse } from 'axios';
import { Item } from '../../../models/Item.model';
import { ItemType } from 'src/models/ItemType.model';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function UpdateItemType() {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<ItemType | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error('No ID provided.');
          return;
        }

        const response: AxiosResponse<ItemType> = await ItemTypeService.getItemTypeById(
          parseInt(id), accessToken
        );
        const data = response.data;
        console.log(data);
        setNewItem(data);
        setDataLoaded(true);
      } catch (error: any) {
        console.error('Error fetching product:', error);
      }
    };

    fetchData();
  }, [id]);

  const validationSchema = Yup.object({
    itemTypeName: Yup.string().required("Name is required"),
  });

  const initialValues: any = {
    itemTypeName: newItem !== null ? newItem.itemTypeName : '',
  };

  useEffect(() => {
    if (newItem && dataLoaded) {
      initialValues.itemTypeName = newItem.itemTypeName || '';
    }
  }, [newItem, dataLoaded]);

  const handleSubmit = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => {
    setLoading(true);
    setServerError(null);
    console.log(values)
    const data = {
      name: values.itemTypeName
    }
    try {
      const response = await ItemTypeService.putItemtype(parseInt(id), data, accessToken);
      console.log(response.data);
      toast.success('ItemType updated successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      navigate('/management/itemType');
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.status === 'User Not Found'
      ) {
        setServerError('User not found. Please check your credentials.');
      } else {
        setServerError(
          error.response?.data?.error ||
          error.message ||
          'An unexpected error occurred'
        );
      }
    } finally {
      setLoading(false);
    }
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
              <Typography variant="h5" component="div" mb={2}>
                Update Item
              </Typography>
              {serverError && (
                <Box mb={2}>
                  <Alert severity="error">{serverError}</Alert>
                </Box>
              )}
              <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
                <Field name="itemTypeName">
                  {({ field }) => (
                    <TextField
                      label="Name"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={isFieldError(field)}
                      helperText={<CustomErrorMessage name="itemTypeName" />}
                    />
                  )}
                </Field>
              </Box>
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  startIcon={loading && <CircularProgress size="1rem" />}
                >
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

export default UpdateItemType;
