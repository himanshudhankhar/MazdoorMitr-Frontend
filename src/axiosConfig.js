import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.REACT_APP_BASE_URL || "http://localhost:5001",
});

export default api;