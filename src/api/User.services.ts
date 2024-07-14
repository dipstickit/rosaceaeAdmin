import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { User } from 'src/types/user.type';
import { UsersReponse } from 'src/models/UserType.model';

type GetUsersParams = {
    page?: number;
    size?: number;
};

const getUserByEmail = (email: string, token: string): Promise<AxiosResponse<User>> => {
    return instance.get(`user/get-user-by-email?email=${email}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};
const getUsers = (params: GetUsersParams, token: string): Promise<AxiosResponse<UsersReponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`user${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};
const banUser = (id: number, token: string): Promise<AxiosResponse<void>> => {
    return instance.put(`user/toggle-status/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};
const getShopProfile = (params: GetUsersParams, token: string, shopId: number): Promise<AxiosResponse<UsersReponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`shop/${shopId}${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};
const changeCoverImage = (data: any, token: string): Promise<AxiosResponse<any>> => {
    return instance.put(`user/changeCoverImage`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            crossDomain: true
        }
    });
};
const changePassword = (userId: number, data: any, token: string): Promise<AxiosResponse<any>> => {
    return instance.put(`user/change-password/${userId}`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
const createNewShop = (data: any, token: string): Promise<AxiosResponse<any>> => {
    return instance.post(`user/create-shop`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
const updateProfile = (data: any, token: string): Promise<AxiosResponse<any>> => {
    return instance.put(`user/update`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
export default {
    getUserByEmail,
    getUsers,
    banUser,
    getShopProfile,
    changeCoverImage,
    changePassword,
    createNewShop,
    updateProfile
};