import { ResponseData } from './../models/Item.model';
import { AxiosResponse } from "axios";
import axios from "./axiosCustomize";
type GetItemParams = {
    page?: number;
    size?: number;
};

const getItem = (params: GetItemParams): Promise<AxiosResponse<any>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return axios.get(`item${queryString ? `?${queryString}` : ''}`);
};

const getItemById = (id: number): Promise<AxiosResponse<any>> => {
    return axios.get(`item/${id}`);
};

const postItem = (values: ResponseData): Promise<AxiosResponse<any>> => {
    return axios.post("item", values);
};

const putItem = (id: number, values: ResponseData): Promise<AxiosResponse<any>> => {
    return axios.put(`item/${id}`, values);
};

const deleteItem = (id: number): Promise<AxiosResponse<any>> => {
    return axios.delete(`item/${id}`);
};

export default {
    getItem,
    getItemById,
    postItem,
    putItem,
    deleteItem,
};
