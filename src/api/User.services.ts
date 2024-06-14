import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { User } from 'src/types/user.type';
import { UsersReponse } from 'src/models/UserType.model';

type GetUsersParams = {
    page?: number;
    size?: number;
};

const getUserByEmail = (email: string, token: string): Promise<AxiosResponse<User>> => {
    return instance.get(`/user/get-user-by-email?email=${email}`, {
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

export default {
    getUserByEmail,
    getUsers,
    banUser
};