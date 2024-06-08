import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { Category, CategoryResponse } from 'src/models/Category.model';

type GetItemParams = {
    page?: number;
    size?: number;
};

const getCategory = (params: GetItemParams, token: string): Promise<AxiosResponse<CategoryResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`category${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getCategoryById = (id: number, token: string): Promise<AxiosResponse<Category>> => {
    return instance.get(`category/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const postCategory = (values: Category, token: string): Promise<AxiosResponse<Category>> => {
    return instance.post("category", values, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const putCategory = (id: number, values: Category, token: string): Promise<AxiosResponse<Category>> => {
    return instance.put(`category/${id}`, values, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const deleteCategory = (id: number, token: string): Promise<AxiosResponse<void>> => {
    return instance.delete(`category/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

export default {
    getCategory,
    getCategoryById,
    postCategory,
    putCategory,
    deleteCategory,
};
