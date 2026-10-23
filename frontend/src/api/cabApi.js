import axiosInstance from './axiosInstance';

export const getCabs = async (params) => {
    const response = await axiosInstance.get('/cabs', { params });
    return response.data;
};
