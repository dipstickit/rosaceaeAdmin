import { Helmet } from 'react-helmet';
import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Box,
  Container,
  Grid,
  Avatar,
  CssBaseline
} from '@mui/material';
import { useFormik } from 'formik';
import { loginValidateSchema } from '../../../validates/ValidateSchema';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { handleSubmit } from 'src/usecases/HandleLogin';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'src/redux/store';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidateSchema,
    onSubmit: (values) => {
      handleSubmit(values.email, values.password, dispatch, navigate);
      console.log('values', values)
      navigate("/dashboards");
    }
  });

  return (
    <>
      <Helmet>
        <title>Rosaceae</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            CHÀO MỪNG TRỞ LẠI!
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Tên đăng nhập"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotpassword" variant="body2">
                  Quên mật khẩu?
                </Link>
              </Grid>
              <Grid item>
                <Link href="signup" variant="body2">
                  {'Nếu bạn chưa có tài khoản, đăng ký tại đây'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            Hoặc đăng nhập bằng
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              mt: 2
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <img
                  src="img_google.svg"
                  alt="google"
                  style={{ height: '24px' }}
                />
              }
              sx={{ mx: 1 }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <img
                  src="img_icon_font_awesome.svg"
                  alt="facebook"
                  style={{ height: '24px' }}
                />
              }
              sx={{ mx: 1 }}
            >
              Facebook
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <img
                  src="img_apple.svg"
                  alt="apple"
                  style={{ height: '24px' }}
                />
              }
              sx={{ mx: 1 }}
            >
              Apple
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
