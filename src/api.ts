import axios from "axios";

const API = axios.create({
   // baseURL: "http://localhost:3000",
   baseURL: "https://projectb-medtrack.onrender.com",
});

// REQUEST
API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// RESPONSE
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // 401: unauthorized
        if (status === 401) {
            sessionStorage.clear();
            window.location.replace("/login");
            return Promise.reject(error);
        }

        // server errors
        if ([500, 502, 503, 504].includes(status)) {
            console.error("Server error:", status);
            return Promise.reject(error); // ❌ do NOT redirect instantly
        }

        // network error
        if (!error.response) {
            console.error("Network error");
            return Promise.reject(error); // ❌ don't auto redirect
        }

        return Promise.reject(error);
    }
);

export default API;