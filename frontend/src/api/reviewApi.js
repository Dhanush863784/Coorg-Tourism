import axiosInstance from './axiosInstance';

export const getReviews = async (type, id) => {
    const response = await axiosInstance.get(`/reviews/${type}/${id}`);
    return response.data;
};
export const createReview = async (data) => {
    const response = await axiosInstance.post(`/reviews`, data);
    return response.data;
};
