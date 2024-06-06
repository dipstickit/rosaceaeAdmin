import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { ResponseData, Item } from './../models/Item.model';

type GetItemParams = {
    page?: number;
    size?: number;
};

const getItem = (params: GetItemParams): Promise<AxiosResponse<ResponseData>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`item${queryString ? `?${queryString}` : ''}`);
};

const getItemById = (id: number): Promise<AxiosResponse<Item>> => {
    return instance.get(`item/${id}`);
};

const postItem = (values: Item): Promise<AxiosResponse<Item>> => {
    return instance.post(`item`, values);
};

const putItem = (id: number, values: Item): Promise<AxiosResponse<Item>> => {
    return instance.put(`item/${id}`, values);
};

const deleteItem = (id: number): Promise<AxiosResponse<void>> => {
    return instance.delete(`item/${id}`);
};

export default {
    getItem,
    getItemById,
    postItem,
    putItem,
    deleteItem,
};
