import { ErrorMessage, ErrorMessageProps } from "formik";
import { Typography } from "@mui/material";

const CustomErrorMessage = (props: ErrorMessageProps) => (
  <ErrorMessage {...props}>
    {msg => <Typography variant="body2" color="error">{msg}</Typography>}
  </ErrorMessage>
);

export default CustomErrorMessage;
