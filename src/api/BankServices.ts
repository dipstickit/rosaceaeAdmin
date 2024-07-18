import axios from 'axios';
import instance from './axiosCustomize';

const getBanks = async () => {
  const response = await axios.get('https://api.vietqr.io/v2/banks');
  return response.data.data;
};

const createBank = async (shopId: number, data: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await instance.post(`bank/${shopId}`, data, config);
  return response.data;
};
const getBankAccounts = async (shopId: number, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await instance.get(`bank/bankAccount/${shopId}`, config);
  return response.data;
};
const updateBankAccount = async (bankId: number, data: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await instance.put(`bank/${bankId}`, data, config);
  return response.data;
};

export default {
  getBanks,
  createBank,
  getBankAccounts,
  updateBankAccount
};
