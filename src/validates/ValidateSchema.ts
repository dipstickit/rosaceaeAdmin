import * as Yup from "yup";

export const loginValidateSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email").required("This field is required"),
    password: Yup.string()
        .required("This field is required")
});





