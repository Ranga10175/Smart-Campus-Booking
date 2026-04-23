import axios from "axios";

const API_URL = "http://localhost:8090/api/bookings";

export const createBooking = (data) => axios.post(API_URL, data);
export const getAllBookings = () => axios.get(API_URL);
export const getUserBookings = (userId) => axios.get(`${API_URL}/user/${userId}`);
export const approveBooking = (id) => axios.put(`${API_URL}/${id}/approve`);
export const rejectBooking = (id, reason) =>
  axios.put(`${API_URL}/${id}/reject`, { reason });
export const cancelBooking = (id) => axios.put(`${API_URL}/${id}/cancel`);
export const deleteBooking = (id) => axios.delete(`${API_URL}/${id}`);