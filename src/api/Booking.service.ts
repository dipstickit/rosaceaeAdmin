import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { Booking, BookingResponse } from 'src/models/Booking.model';

type GetBookingParams = {
    page?: number;
    size?: number;
};

const getBookingByShop = (params: GetBookingParams, token: string, shopId: number): Promise<AxiosResponse<BookingResponse>> => {
    const queryString = Object.entries(params)
        .map(([key, value]) => value ? `${key}=${value}` : '')
        .filter(Boolean)
        .join('&');
    return instance.get(`booking/user/${shopId}${queryString ? `?${queryString}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const getBookingById = (id: number, token: string): Promise<AxiosResponse<Booking>> => {
    return instance.get(`category/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
};

const updateBookingStatus = (token: string, data: any): Promise<AxiosResponse<string>> => {
    return instance.put(`booking/status`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}

const getOrderStatusPercentage = (id: number, token: string): Promise<AxiosResponse<Map<string, number>>> => {
    return instance.get(`booking/shop/${id}/status-percentages`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}

const getOrderStatusPercentageAdmin = (token: string): Promise<AxiosResponse<Map<string, number>>> => {
    return instance.get(`booking/admin/status-percentages`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}

const completeBooking = (token: string, id: number): Promise<AxiosResponse<string>> => {
    return instance.put(`booking/complete/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            crossDomain: true
        }
    });
}

export default {
    getBookingByShop,
    getBookingById,
    updateBookingStatus,
    getOrderStatusPercentage,
    getOrderStatusPercentageAdmin,
    completeBooking
};
