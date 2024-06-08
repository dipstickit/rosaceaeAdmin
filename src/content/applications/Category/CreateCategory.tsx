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
import CatgoryService from '../../../api/Category.service';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function CreateItem() {
  let accessToken: string = useSelector((state: any) => state.auth.userToken) !== null ? 
  useSelector((state: any) => state.auth.userToken) : localStorage.getItem("userToken")
  console.log(accessToken)
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues = {
    categoryName: "",
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required('CategoryName is required'),
  });

  const handleSubmit = async (formValue) => {
    console.log(formValue);
    setLoading(true);
    setServerError(null);
  
    try {
      const item = await CatgoryService.postCategory({ ...formValue }, accessToken);
      console.log(item);
      toast.success('Create category successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      navigate("/management/category");
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
                <Field name="categoryName">
                  {({ field }) => (
                    <TextField
                      label="Category Name"
                      fullWidth
                      variant="outlined"
                      {...field}
                      error={isFieldError(field)}
                      helperText={<CustomErrorMessage name="categoryName" />}
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
