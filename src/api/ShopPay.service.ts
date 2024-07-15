import { AxiosResponse } from 'axios';
import instance from './axiosCustomize';
import { ShopPayTypeResponse } from 'src/models/ShopPayType.model';

type GetShopPayParams = {
  month: number;
  year: number;
  page: number;
  int: number;
};

const getShopPay = (
  params: GetShopPayParams,
  token: string
): Promise<AxiosResponse<ShopPayTypeResponse>> => {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return instance.get(`/admin/shopPay?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      crossDomain: true
    }
  });
};
const confirmPayment = (
  shopId: number,
  token: string
): Promise<AxiosResponse<void>> => {
  return instance.put(`/admin/confirm/${shopId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
      crossDomain: true
    }
  });
};

export default {
  getShopPay,
  confirmPayment
};
