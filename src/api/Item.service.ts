import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { ResponseData, Item } from './../models/Item.model';

type GetItemParams = {
    page?: number;
    size?: number;
};

const getItem = (params: GetItemParams, token: string): Promise<AxiosResponse<ResponseData>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`item${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getItemByShopId = (params: GetItemParams, token: string, userId: number): Promise<AxiosResponse<ResponseData>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`item/user/${userId}${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getItemById = (id: number, token: string): Promise<AxiosResponse<Item>> => {
    return instance.get(`item/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const postItem = (values: any, token: string): Promise<AxiosResponse<Item>> => {
    return instance.post(`item`, values, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            crossDomain: true
        }
    });
};

const putItem = (id: number, values: Item, token: string): Promise<AxiosResponse<Item>> => {
    return instance.put(`item/${id}`, values, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const deleteItem = (id: number, token: string): Promise<AxiosResponse<void>> => {
    return instance.delete(`item/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

export default {
    getItem,
    getItemByShopId,
    getItemById,
    postItem,
    putItem,
    deleteItem,
};
