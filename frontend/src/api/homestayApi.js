import axiosInstance from './axiosInstance';

export const getHomestays = async (params) => {
    const response = await axiosInstance.get('/homestays', { params });
    return response.data;
};
export const getHomestayById = async (id) => {
    const response = await axiosInstance.get(`/homestays/${id}`);
    return response.data;
};
