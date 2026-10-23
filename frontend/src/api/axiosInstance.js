import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8089/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const publicEndpoints = ['/auth/login', '/users'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url === endpoint || config.url.startsWith(endpoint + '?'));
        
        if (!isPublicEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
