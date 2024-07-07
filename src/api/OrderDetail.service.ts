import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { OrderDetail, OrderDetailResponse } from 'src/models/OrderDetail.model';

type GetOrderDetailParams = {
    page?: number;
    size?: number;
};

export interface DailyPriceForShopResponse {
    day: number
    totalPriceForShop: number
}
export interface DailyOrderCountResponse {
    day: number
    count: number
}

const getOrderDetailByShop = (params: GetOrderDetailParams, token: string, shopId: number): Promise<AxiosResponse<OrderDetailResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`/order/shop/${shopId}${queryString ? `?${queryString}` : ''}`, {
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

const getTotalPrice = (id: number, month: number, year: number, token: string): Promise<AxiosResponse<any>> => {
    return instance.get(`order/total-price-for-shop?userId=${id}&month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getRevenueEachDay = (id: number, month: number, year: number, token: string): Promise<AxiosResponse<DailyPriceForShopResponse[]>> => {
    return instance.get(`order/daily-price-for-shop?userId=${id}&month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getOrderEachDay = (id: number, month: number, year: number, token: string): Promise<AxiosResponse<DailyOrderCountResponse[]>> => {
    return instance.get(`order/order-count-by-day?userId=${id}&month=${month}&year=${year}`, {
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
    getOrderDetailByOrderId,
    getTotalPrice,
    getRevenueEachDay,
    getOrderEachDay
};
