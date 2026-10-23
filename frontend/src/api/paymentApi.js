import axiosInstance from './axiosInstance';

export const createPayment = async (data) => {
    const response = await axiosInstance.post('/payments', data);
    return response.data;
};

export const processPayment = async (paymentId) => {
    const response = await axiosInstance.post(`/payments/${paymentId}/process`);
    return response.data;
};

export const getMyPayments = async () => {
    const response = await axiosInstance.get('/payments/my');
    return response.data;
};

export const getAllPayments = async () => {
    const response = await axiosInstance.get('/payments');
    return response.data;
};
