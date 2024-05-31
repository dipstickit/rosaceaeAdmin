import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import { AuthData } from "../types/authData.type";
import { ResponseSuccessful } from "../types/response.type";

const instance: AxiosInstance = axios.create({
    baseURL: "https://b3c5-2405-4802-900a-df30-81c6-4a8a-a7bb-3a4c.ngrok-free.app/api/v1/",
    withCredentials: false,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
});

instance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig<any>) {

        const authDataString = localStorage.getItem("persist:root");
        if (authDataString) {
            const authData: AuthData = JSON.parse(authDataString).auth;
            const token = authData?.access_Token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    function (error: AxiosError) {
        return Promise.reject(error);
    }
);



instance.interceptors.response.use(
    function (response: AxiosResponse<ResponseSuccessful<any>>): AxiosResponse<ResponseSuccessful<any>> {
        return response;
    },
    function (error: AxiosError) {
        const status = error.response?.status || 500;
        switch (status) {
            case 401:
                console.error('Unauthorized access. Redirecting to login page...');
                break;
            default:
                return error.response?.data ? error.response.data : error;

        }
    }
);

export default instance;
