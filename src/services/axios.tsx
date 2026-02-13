import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3100",
    //baseURL: "https://bora-entender-back-production-85b5.up.railway.app",
});

// Interceptor de requisição
api.interceptors.request.use(
    async (config: any) => {
        const token = localStorage.getItem("@BoraEntender:token");

        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // Incluindo o token no cabeçalho da requisição
        }
        
        return config; // Retornando a configuração modificada
    },
    (error: any) => {
        return Promise.reject(new Error(error.message ?? "Erro no Axios")); // Tratamento de erro
    }
);

export default api;