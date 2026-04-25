import axios from "axios";

const API_URL = "http://localhost:8091/api/auth";

export const registerUser = (userData) => axios.post(`${API_URL}/register`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const socialLogin = (socialData) => axios.post(`${API_URL}/social-login`, socialData);
