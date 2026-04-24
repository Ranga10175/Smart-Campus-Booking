import axios from "axios";

const API_URL = "http://localhost:8091/api/notifications";

// Admin Notifications
export const getAdminNotifications = () => axios.get(`${API_URL}/admin`);
export const markAllAdminNotificationsAsRead = () => axios.put(`${API_URL}/admin/mark-all-read`);
export const deleteAdminNotification = (id) => axios.delete(`${API_URL}/admin/${id}`);

// Student Notifications
export const getStudentNotifications = (userId) => axios.get(`${API_URL}/student/${userId}`);
export const markAllStudentNotificationsAsRead = (userId) => axios.put(`${API_URL}/student/${userId}/mark-all-read`);
export const deleteStudentNotification = (userId, id) => axios.delete(`${API_URL}/student/${userId}/${id}`);

// Shared
export const markNotificationAsRead = (id) => axios.put(`${API_URL}/${id}/read`);

// Admin managing student notifications
export const getAllStudentNotificationsForAdmin = () => axios.get(`${API_URL}/admin/students`);
export const updateStudentNotificationForAdmin = (id, data) => axios.put(`${API_URL}/admin/students/${id}`, data);
