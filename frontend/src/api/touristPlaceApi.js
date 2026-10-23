import axiosInstance from './axiosInstance';

export const getTouristPlaces = async (params) => {
    const response = await axiosInstance.get('/tourist-places', { params });
    return response.data;
};

export const getTouristPlaceById = async (id) => {
    const response = await axiosInstance.get(`/tourist-places/${id}`);
    return response.data;
};
