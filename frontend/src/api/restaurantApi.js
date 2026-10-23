import axiosInstance from './axiosInstance';

export const getRestaurants = async (params) => {
    const response = await axiosInstance.get('/restaurants', { params });
    return response.data;
};
