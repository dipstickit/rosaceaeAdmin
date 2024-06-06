import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ItemTypeService from '../../../api/Itemtype.service';

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
import { ItemType } from "src/models/ItemType.model";
import { toast } from "react-toastify";

function CreateItemType() {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues = {
    itemTypeName: "",
  };

  const validationSchema = Yup.object({
    itemTypeName: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (formValue) => {
    console.log(formValue);
    setLoading(true);
    setServerError(null);
  
    try {
      const item = await ItemTypeService.postItemType({ ...formValue });
      console.log(item);
      toast.success('Create ItemType successfully', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      navigate("/management/itemType");
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
                Create Item
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

export default CreateItemType;
