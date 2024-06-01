import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { ItemType, ItemTypesResponse } from './../models/ItemType.model';

type GetItemParams = {
    page?: number;
    size?: number;
};

const getItemType = (params: GetItemParams): Promise<AxiosResponse<ItemTypesResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`itemType${queryString ? `?${queryString}` : ''}`);
};

const getItemTypeById = (id: number): Promise<AxiosResponse<ItemType>> => {
    return instance.get(`itemType/${id}`);
};

const postItemType = (values: ItemType): Promise<AxiosResponse<ItemType>> => {
    return instance.post("itemType", values);
};

const putItemtype = (id: number, values: ItemType): Promise<AxiosResponse<ItemType>> => {
    return instance.put(`itemType/${id}`, values);
};

const deleteItemType = (id: number): Promise<AxiosResponse<void>> => {
    return instance.delete(`itemType/${id}`);
};

export default {
    getItemType,
    getItemTypeById,
    postItemType,
    putItemtype,
    deleteItemType,
};
