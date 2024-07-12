import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig
} from 'axios';
import { AuthData } from '../types/authData.type';
import { ResponseSuccessful } from '../types/response.type';

const instance: AxiosInstance = axios.create({
  baseURL: 'https://joint-socially-pipefish.ngrok-free.app/api/v1/',
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': 'true'
  }
});

// instance.interceptors.request.use(
//     function (config: InternalAxiosRequestConfig<any>) {
//         try {
//             const authDataString = localStorage.getItem("userToken");
//             if (authDataString) {
//                 const parsedData = JSON.parse(authDataString);
//                 const authData: AuthData = JSON.parse(parsedData.auth);
//                 const token = authData?.access_Token;

//                 if (token) {
//                     config.headers.Authorization = `Bearer ${token}`;
//                     console.log("Token:", token);
//                 } else {
//                     console.error("No token found");
//                 }
//             }
//         } catch (error) {
//             console.error('Error parsing auth data from localStorage:', error);
//         }
//         return config;
//     },
//     function (error: AxiosError) {
//         return Promise.reject(error);
//     }
// );

// instance.interceptors.request.use(
//     async function (config: InternalAxiosRequestConfig<any>) {
//         try {
//             const authDataString = localStorage.getItem("userToken");
//             if (authDataString) {
//                 const parsedData = JSON.parse(authDataString);
//                 const authData: AuthData = JSON.parse(parsedData.auth);
//                 const token = authData?.access_Token;

//                 if (token) {

//                     const tokenExpiration = authData?.expires_in;
//                     const tokenExpirationThreshold = 60000;
//                     const currentTime = Date.now();
//                     if (typeof tokenExpiration === 'number' && tokenExpiration - currentTime <= tokenExpirationThreshold) {
//                         await refreshToken();
//                         const newTokenDataString = localStorage.getItem("token");
//                         if (newTokenDataString) {
//                             const newParsedData = JSON.parse(newTokenDataString);
//                             const newAuthData: AuthData = JSON.parse(newParsedData.auth);
//                             const newToken = newAuthData?.access_Token;
//                             if (newToken) {
//                                 config.headers.Authorization = `Bearer ${newToken}`;
//                             } else {
//                                 console.error("No new token found after refresh.");
//                             }
//                         } else {
//                             console.error("No token data found after refresh.");
//                         }
//                     } else {
//                         config.headers.Authorization = `Bearer ${token}`;
//                     }
//                 } else {
//                     console.error("No token found");
//                 }
//             }
//         } catch (error) {
//             console.error('Error parsing auth data from localStorage:', error);
//         }
//         return config;
//     },
//     function (error: AxiosError) {
//         return Promise.reject(error);
//     }
// );

// instance.interceptors.response.use(
//     function (response: AxiosResponse<ResponseSuccessful<any>>): AxiosResponse<ResponseSuccessful<any>> {
//         return response;
//     },
//     function (error: AxiosError) {
//         const status = error.response?.status || 500;
//         switch (status) {
//             case 401:
//                 console.error('Unauthorized access. Redirecting to login page...');
//                 break;
//             case 403:
//                 console.error('Forbidden access. You do not have the necessary permissions.');
//                 break;
//             default:
//                 console.error('An error occurred:', error.message);
//                 break;
//         }
//         return Promise.reject(error);
//     }
// );

// async function refreshToken() {
//     try {
//         const response = await instance.post("auth/refresh-token", {
//             // Add any necessary data for refreshing token
//         });
//         const newToken = response.data.token;
//         if (newToken) {
//             // Update token in local storage or wherever it's stored
//             localStorage.setItem("token", newToken);
//         } else {
//             console.error("No new token received.");
//         }
//     } catch (error) {
//         console.error("Error refreshing token:", error);
//     }
// }

export default instance;
