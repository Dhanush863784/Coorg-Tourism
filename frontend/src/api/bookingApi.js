import axiosInstance from './axiosInstance';

export const createBooking = async (data) => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await axiosInstance.get('/customer/bookings');
    return response.data;
};

export const getOwnerBookings = async () => {
    const response = await axiosInstance.get('/owner/bookings');
    return response.data;
};

export const getAllBookings = async () => {
    const response = await axiosInstance.get('/bookings');
    return response.data;
};

export const updateBookingStatus = async (id, status) => {
    const response = await axiosInstance.put(`/bookings/${id}/status`, { status });
    return response.data;
};
