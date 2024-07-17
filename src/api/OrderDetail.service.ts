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
export interface DailyPriceForAdminResponse {
    day: number
    totalPriceForAdmin: number
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

const getOrderDetailAdmin = (params: GetOrderDetailParams, token: string): Promise<AxiosResponse<OrderDetailResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`/order/details${queryString ? `?${queryString}` : ''}`, {
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

const getTotalPriceBooking = (id: number, month: number, year: number, token: string): Promise<AxiosResponse<any>> => {
    return instance.get(`order/total-price-for-shop2?userId=${id}&month=${month}&year=${year}`, {
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

const getTotalPriceAdmin = (month: number, year: number, token: string): Promise<AxiosResponse<any>> => {
    return instance.get(`order/total-price-for-admin?month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}

const getRevenueEachDayAdmin = (month: number, year: number, token: string): Promise<AxiosResponse<DailyPriceForShopResponse[]>> => {
    return instance.get(`order/daily-price-for-admin?month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getOrderEachDayAdmin = (month: number, year: number, token: string): Promise<AxiosResponse<DailyOrderCountResponse[]>> => {
    return instance.get(`order/order-count-by-day-for-Admin?month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getCompletedBookings = (id: number, month: number, year: number, token: string): Promise<AxiosResponse<DailyOrderCountResponse>> => {
    return instance.get(`order/completed-order-count-by-day-forShop?userId=${id}&month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
const getRevenueCompletedBookings = (id: number, month: number, year: number, token: string): Promise<AxiosResponse<DailyPriceForShopResponse>> => {
    return instance.get(`order/total-price-by-day-onlyService-forShop?userId=${id}&month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
const getCompletedBookingsAdmin = (month: number, year: number, token: string): Promise<AxiosResponse<DailyOrderCountResponse>> => {
    return instance.get(`order/completed-order-count-by-day-forAdmin?month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
const getRevenueCompletedBookingsAdmin = (month: number, year: number, token: string): Promise<AxiosResponse<DailyPriceForShopResponse>> => {
    return instance.get(`order/total-price-by-day-onlyService-forAdmin?month=${month}&year=${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}
export default {
    getOrderDetailByShop,
    getOrderDetailByOrderId,
    getTotalPrice,
    getRevenueEachDay,
    getOrderEachDay,
    getTotalPriceAdmin,
    getRevenueEachDayAdmin,
    getOrderEachDayAdmin,
    getCompletedBookings,
    getRevenueCompletedBookings,
    getCompletedBookingsAdmin,
    getRevenueCompletedBookingsAdmin,
    getTotalPriceBooking,
    getOrderDetailAdmin
};
