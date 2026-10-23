import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
};
