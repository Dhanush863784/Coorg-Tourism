import axiosInstance from './axiosInstance';

export const generateTrip = async (data) => {
    const response = await axiosInstance.post('/trips/generate', data);
    return response.data;
};
export const getMyTrips = async () => {
    const response = await axiosInstance.get('/customer/trips');
    return response.data;
};
