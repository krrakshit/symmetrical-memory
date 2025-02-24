import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Change this to your backend URL
  withCredentials: true, // Ensures cookies are sent
});

export default api;
