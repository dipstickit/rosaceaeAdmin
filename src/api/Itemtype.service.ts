import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { ItemType, ItemTypesResponse } from './../models/ItemType.model';

type GetItemParams = {
    page?: number;
    size?: number;
};

const getItemType = (params: GetItemParams, token: string): Promise<AxiosResponse<ItemTypesResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`itemType${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getItemTypeById = (id: number, token: string): Promise<AxiosResponse<ItemType>> => {
    return instance.get(`itemType/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const postItemType = (values: ItemType, token: string): Promise<AxiosResponse<ItemType>> => {
    return instance.post("itemType", values, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const putItemtype = (id: number, values: any, token: string): Promise<AxiosResponse<ItemType>> => {
    return instance.put(`itemType/${id}`, values, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const deleteItemType = (id: number, token: string): Promise<AxiosResponse<void>> => {
    return instance.delete(`itemType/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

export default {
    getItemType,
    getItemTypeById,
    postItemType,
    putItemtype,
    deleteItemType,
};
