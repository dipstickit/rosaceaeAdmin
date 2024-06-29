import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import CustomErrorMessage from '../../../components/CustomErrormessage';
import { AxiosResponse } from 'axios';
import { Item } from '../../../models/Item.model';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { ItemTypesResponse } from 'src/models/ItemType.model';
import { CategoryResponse } from 'src/models/Category.model';
import ItemtypeService from 'src/api/Itemtype.service';
import CategoryService from 'src/api/Category.service';

function UpdateItem() {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)

  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Item | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [itemType, setItemType] = useState<ItemTypesResponse['content']>([])
  const [category, setCategory] = useState<CategoryResponse['content']>([])
  const [initialValues, setInitialValues] = useState<any>({
    itemName: '',
    quantity: 0,
    itemPrice: 0,
    itemDescription: '',
    discount: 0,
    itemTypeId: 0,
    categoryId: 0
  })

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error('No ID provided.');
          return;
        }
        const response: AxiosResponse<any> = await ItemService.getItemById(
          parseInt(id), accessToken
        );
        const itemTypeResponse: AxiosResponse<ItemTypesResponse> = await ItemtypeService.getItemType({}, accessToken);
        const categoryResponse: AxiosResponse<CategoryResponse> = await CategoryService.getCategory({}, accessToken);
        const data = response.data;
        console.log();
        setItemType(itemTypeResponse.data.content);
        setCategory(categoryResponse.data.content)
        setInitialValues({
          itemName: data.itemName || '',
          quantity: data.quantity || 0,
          itemPrice: data.itemPrice || 0,
          itemDescription: data.itemDescription || '',
          discount: data.discount || 0,
          itemTypeId: itemTypeResponse.data.content.find(x => x.itemTypeId === data.itemType.itemTypeId).itemTypeId,
          categoryId: categoryResponse.data.content.find(x => x.categoryId === data.category.categoryId).categoryId
        })
        setNewItem(data.item);
        setDataLoaded(true);
      } catch (error: any) {
        console.error('Error fetching product:', error);
      }
    };

    fetchData();
  }, [id]);

  const validationSchema = initialValues !== null && initialValues.itemTypeId === 2 ?
    Yup.object({
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
        .min(1, 'Category ID must be greater than 0')
    }) :
    Yup.object({
      itemName: Yup.string().required('Item name is required'),
      quantity: Yup.number()
        .min(0, 'Quantity must be greater than 0'),
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
        .min(1, 'Category ID must be greater than 0')
    })
    ;

  const handleSubmit = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => {
    setLoading(true);
    setServerError(null);

    try {
      const response = await ItemService.putItem(parseInt(id), values, accessToken);
      console.log(id)
      console.log(values)
      console.log(response.data);
      toast.success('Item updated successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      navigate('/management/item');
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

  const renderListItemType = itemType.length > 0 ? itemType.map((item, index) => {
    return (
      <MenuItem key={item.itemTypeId} value={item.itemTypeId}>{item.itemTypeName}</MenuItem>
    )
  }) : null

  const renderCategory = category.length > 0 ? category.map((item, index) => {
    return (
      <MenuItem key={item.categoryId} value={item.categoryId}>{item.categoryName}</MenuItem>
    )
  }) : null

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
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
                <Field name="itemName">
                  {({ field }) => (
                    <TextField
                      label="Item Name"
                      fullWidth
                      variant="outlined"
                      defaultValue={newItem ? newItem.itemName : ""}
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
                <Field name="itemTypeId">
                  {({ field, form }) => (
                    <FormControl fullWidth variant="filled" error={Boolean(form.errors.itemTypeId && form.touched.itemTypeId)}>
                      <InputLabel id="itemTypeId-label">Item Type</InputLabel>
                      <Select
                        labelId="itemTypeId-label"
                        id="itemTypeId"
                        label="Item Type ID"
                        {...field}
                      >
                        {renderListItemType}
                      </Select>
                    </FormControl>

                  )}
                </Field>
                <Field name="categoryId">
                  {({ field, form }) => (
                    <FormControl fullWidth variant="filled" error={Boolean(form.errors.categoryId && form.touched.categoryId)}>
                      <InputLabel id="categoryId-label">Category</InputLabel>
                      <Select
                        labelId="categoryId-label"
                        id="categoryId"
                        label="Category ID"
                        {...field}
                      >
                        {renderCategory}
                      </Select>
                    </FormControl>

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

export default UpdateItem;
