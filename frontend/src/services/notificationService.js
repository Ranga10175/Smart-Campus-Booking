import axios from "axios";

const API_URL = "http://localhost:8081/api/notifications";

export const getStudentNotifications = (userId) => axios.get(`${API_URL}/student/${userId}`);
export const getAdminNotifications = () => axios.get(`${API_URL}/admin`);
export const getAllStudentNotificationsForAdmin = () => axios.get(`${API_URL}/admin/student-notifications`);
export const markNotificationAsRead = (notificationId) => axios.put(`${API_URL}/${notificationId}/read`);
export const markAllStudentNotificationsAsRead = (userId) =>
  axios.put(`${API_URL}/student/${userId}/read-all`);
export const markAllAdminNotificationsAsRead = () => axios.put(`${API_URL}/admin/read-all`);
export const deleteStudentNotification = (userId, notificationId) =>
  axios.delete(`${API_URL}/student/${userId}/${notificationId}`);
export const deleteAdminNotification = (notificationId) =>
  axios.delete(`${API_URL}/admin/${notificationId}`);
export const updateStudentNotificationForAdmin = (notificationId, data) =>
  axios.put(`${API_URL}/admin/student/${notificationId}`, data);
