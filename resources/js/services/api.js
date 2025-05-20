import axios from "axios";

// Create an Axios instance with base URL from env
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add token to request if available
api.interceptors.request.use(async (config) => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token"));
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

// API Endpoints

// Songs
export const songAPI = {
    getAll: () => api.get("/songs"),
    get: (id) => api.get(`/songs/${id}`),
    create: (formData) =>
        api.post("/admin/songs", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    update: (id, formData) =>
        api.post(`/admin/songs/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    delete: (id) => api.delete(`/admin/songs/${id}`),
};

// Wallpapers
export const wallpaperAPI = {
    getAll: () => api.get("/admin/wallpapers"),
    get: (id) => api.get(`/admin/wallpapers/${id}`),
    create: (formData) =>
        api.post("/admin/wallpapers", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    update: (id, formData) =>
        api.post(`/admin/wallpapers/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    delete: (id) => api.delete(`/admin/wallpapers/${id}`),
};

// Genres
export const genreAPI = {
    getAll: () => api.get("/genres"),
    get: (id) => api.get(`/admin/genres/${id}`),
    create: (data) => api.post("/admin/genres", data),
    update: (id, data) => api.put(`/admin/genres/${id}`, data),
    delete: (id) => api.delete(`/admin/genres/${id}`),
};

// Laravel Admin Authentication
export const adminAPI = {
    login: (credentials) => api.post("/admin/login", credentials),
    logout: () => api.post("/admin/logout"),
    getUser: () => api.get("/admin/user"),
};

export default api;
