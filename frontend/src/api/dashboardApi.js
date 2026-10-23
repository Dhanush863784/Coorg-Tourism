import axiosInstance from './axiosInstance';

export const getCustomerDashboard = async () => {
    const response = await axiosInstance.get('/customer/dashboard');
    return response.data;
};

export const getOwnerDashboard = async () => {
    const response = await axiosInstance.get('/owner/dashboard');
    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
};
