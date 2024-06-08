import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { User } from 'src/types/user.type';

const getUserByEmail = (email: string, token: string): Promise<AxiosResponse<User>> => {
    return instance.get(`/user/get-user-by-email?email=${email}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

export default {
    getUserByEmail
};