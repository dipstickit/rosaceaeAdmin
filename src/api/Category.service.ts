import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { Category, CategoryResponse } from 'src/models/Category.model';

type GetItemParams = {
    page?: number;
    size?: number;
};

const getCategory = (params: GetItemParams): Promise<AxiosResponse<CategoryResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`category${queryString ? `?${queryString}` : ''}`);
};

const getCategoryById = (id: number): Promise<AxiosResponse<Category>> => {
    return instance.get(`category/${id}`);
};

const postCategory = (values: Category): Promise<AxiosResponse<Category>> => {
    return instance.post("category", values);
};

const putCategory = (id: number, values: Category): Promise<AxiosResponse<Category>> => {
    return instance.put(`category/${id}`, values);
};

const deleteCategory = (id: number): Promise<AxiosResponse<void>> => {
    return instance.delete(`category/${id}`);
};

export default {
    getCategory,
    getCategoryById,
    postCategory,
    putCategory,
    deleteCategory,
};
