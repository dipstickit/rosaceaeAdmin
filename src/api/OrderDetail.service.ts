import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { OrderDetail, OrderDetailResponse } from 'src/models/OrderDetail.model';

type GetOrderDetailParams = {
    page?: number;
    size?: number;
};

const getOrderDetailByShop = (params: GetOrderDetailParams, token: string, shopId: number): Promise<AxiosResponse<OrderDetailResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`/shop/${shopId}${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getOrderDetailByOrderId = (id: number, token: string): Promise<AxiosResponse<OrderDetail>> => {
    return instance.get(`category/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

// const postCategory = (values: OrderDetail, token: string): Promise<AxiosResponse<OrderDetail>> => {
//     return instance.post("category", values, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             crossDomain: true
//         }
//     });
// };

// const putCategory = (id: number, values: OrderDetail, token: string): Promise<AxiosResponse<OrderDetail>> => {
//     return instance.put(`category/${id}`, values, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             crossDomain: true
//         }
//     });
// };

// const deleteCategory = (id: number, token: string): Promise<AxiosResponse<void>> => {
//     return instance.delete(`category/${id}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             crossDomain: true
//         }
//     });
// };

export default {
    getOrderDetailByShop,
    getOrderDetailByOrderId
};
