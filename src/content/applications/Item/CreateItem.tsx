import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import CustomErrorMessage from '../../../components/CustomErrormessage';
import { Item } from "src/models/Item.model";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ItemType, ItemTypesResponse } from "src/models/ItemType.model";
import ItemtypeService from "src/api/Itemtype.service";
import { CategoryResponse } from "src/models/Category.model";
import CategoryService from "src/api/Category.service";
import jwt_decode from "jwt-decode";
import UserService from '../../../api/User.services';
import { useAppDispatch } from "src/redux/store";
import { setUser } from '../../../redux/slices/auth.slice';
import { AxiosResponse } from "axios";

function CreateItem() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ?
    useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  let user = useSelector((state: any) => state.auth.userInfo)
  console.log(accessToken)
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [files, setFiles] = useState<any>(null);
  const [itemType, setItemType] = useState<ItemTypesResponse['content']>([])
  const [category, setCategory] = useState<CategoryResponse['content']>([])
  const [initialValues, setInitialValues] = useState<any>({
    itemName: "",
    quantity: 0,
    itemPrice: 0,
    itemDescription: "",
    discount: 0,
    shopId: 0,
    itemTypeId: 0,
    categoryId: 0,
    userName: ''
  })

  const getUserByEmail = async () => {
    var decoded = jwt_decode(accessToken);
    const response = await UserService.getUserByEmail(decoded["sub"], accessToken)
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('userToken');
      navigate('/login')
      return
    }
    user = response.data['userInfo']
    dispatch(setUser(user));
  }

  if (user === null) {
    console.log("user is null")
    getUserByEmail()
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemTypeResponse: AxiosResponse<ItemTypesResponse> = await ItemtypeService.getItemType({}, accessToken);
        const categoryResponse: AxiosResponse<CategoryResponse> = await CategoryService.getCategory({}, accessToken);
        console.log('Response data:', itemTypeResponse.data.content[0].itemTypeId);
        if (categoryResponse.data.content && itemTypeResponse.data.content) {
          setItemType(itemTypeResponse.data.content);
          setCategory(categoryResponse.data.content)
          setInitialValues({
            itemName: "",
            quantity: "",
            itemPrice: "",
            itemDescription: "",
            discount: "",
            shopId: user.usersID || 0,
            itemTypeId: itemTypeResponse.data.content[0].itemTypeId || 0,
            categoryId: categoryResponse.data.content[0].categoryId || 0,
            userName: user.accountName || ''
          })
        }
        else {
          throw new Error('No content in response data.');
        }
      } catch (error) {
        console.error('Error fetching items:', (error as Error).message);
      }
    };

    fetchItem()
  }, [])



  const validationSchema = Yup.object({
    itemName: Yup.string().required('Item name is required'),
    userName: Yup.string().required('Item name is required'),
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

  const handleFileChange = (e: any) => {
    setFiles({
      files: e.target.files,
    });
  };

  const handleSubmit = async (formValue) => {
    console.log(formValue);
    console.log(files)
    setLoading(true);
    setServerError(null);

    try {
      const data = new FormData();
      data.append('itemName', formValue.itemName);
      data.append('quantity', formValue.quantity);
      data.append('itemPrice', formValue.itemPrice);
      data.append('itemDescription', formValue.itemDescription);
      data.append('discount', formValue.discount);
      data.append('shopId', formValue.shopId);
      data.append('itemTypeId', formValue.itemTypeId);
      data.append('categoryId', formValue.categoryId);
      for (let i = 0; i < files.files.length; i++) {
        data.append('files', files.files[i]);
      }
      console.log([...data.entries()])
      const item = await ItemService.postItem(data, accessToken);
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
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <>
          {/* <div>{initialValues.userName !== null ? initialValues.userName : ""}</div> */}
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
                  <Field name="userName">
                    {({ field }) => (
                      <TextField
                        label="Shop"
                        fullWidth
                        variant="outlined"
                        {...field}
                        disabled
                        onClick={e => e.preventDefault()}
                        error={isFieldError(field)}
                        helperText={<CustomErrorMessage name="userName" />}
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
                  <input
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    multiple
                  />
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
        </>
      )
      }
    </Formik>

  );
}

export default CreateItem;
