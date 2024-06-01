import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ItemService from '../../../api/Item.service';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CustomErrorMessage from '../../../components/CustomErrormessage';
import { Item } from "src/models/Item.model";
import { toast } from "react-toastify";

function CreateItem() {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues = {
    itemName: "",
    quantity: "",
    itemPrice: "",
    itemDescription: "",
    discount: "",
    shopId: "",
    itemTypeId: "",
    categoryId: ""
  };

  const validationSchema = Yup.object({
    itemName: Yup.string().required('Item name is required'),
    quantity: Yup.number()
      .required('Quantity is required')
      .min(1, 'Quantity must be greater than 0'),
    itemPrice: Yup.number()
      .required('Price is required')
      .min(1, 'Price must be greater than 0'),
    itemDescription: Yup.string().required('Item Description is required'),
    discount: Yup.number()
      .required('Discount is required')
      .min(1, 'Discount must be greater than or equal to 0'),
    itemTypeId: Yup.number()
      .required('Item Type ID is required')
      .min(1, 'Item Type ID must be greater than 0'),
    categoryId: Yup.number()
      .required('Category ID is required')
      .min(1, 'Category ID must be greater than 0'),
      shopId: Yup.number()
      .required('Shop ID is required')
      .min(1, 'Shop ID must be greater than 0')
  });

  const handleSubmit = async (formValue) => {
    console.log(formValue);
    setLoading(true);
    setServerError(null);
  
    try {
      const item = await ItemService.postItem({ ...formValue });
      console.log(item);
      toast.success('Create Item successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      navigate("/management/item");
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" mb={2}>
                Create ItemType
              </Typography>
              {serverError && (
                <Box mb={2}>
                  <Alert severity="error">{serverError}</Alert>
                </Box>
              )}
              <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
                <Field name="itemName">
                  {({ field }) => (
                    <TextField
                      label="Item Name"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={isFieldError(field)}
                      helperText={<CustomErrorMessage name="itemName" />}
                    />
                  )}
                </Field>
                <Field name="quantity">
                  {({ field }) => (
                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={Boolean(field.value && isNaN(field.value))}
                      helperText={<CustomErrorMessage name="quantity" />}
                    />
                  )}
                </Field>
                <Field name="itemPrice">
                  {({ field }) => (
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={Boolean(field.value && isNaN(field.value))}
                      helperText={<CustomErrorMessage name="itemPrice" />}
                    />
                  )}
                </Field>
                <Field name="itemDescription">
                  {({ field }) => (
                    <TextField
                      label="Description"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={isFieldError(field)}
                      helperText={<CustomErrorMessage name="itemDescription" />}
                    />
                  )}
                </Field>
                <Field name="discount">
                  {({ field }) => (
                    <TextField
                      label="Discount"
                      type="number"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={Boolean(field.value && isNaN(field.value))}
                      helperText={<CustomErrorMessage name="discount" />}
                    />
                  )}
                </Field>
                <Field name="shopId">
                  {({ field }) => (
                    <TextField
                      label="Shop ID"
                      type="number"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={Boolean(field.value && isNaN(field.value))}
                      helperText={<CustomErrorMessage name="shopId" />}
                    />
                  )}
                </Field>
                <Field name="itemTypeId">
                  {({ field }) => (
                    <TextField
                      label="Item Type ID"
                      type="number"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={Boolean(field.value && isNaN(field.value))}
                      helperText={<CustomErrorMessage name="itemTypeId" />}
                    />
                  )}
                </Field>
                <Field name="categoryId">
                  {({ field }) => (
                    <TextField
                      label="Category ID"
                      type="number"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={Boolean(field.value && isNaN(field.value))}
                      helperText={<CustomErrorMessage name="categoryId" />}
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

export default CreateItem;
