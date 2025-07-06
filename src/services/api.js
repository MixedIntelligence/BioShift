import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';

const apiClient = axios.create({
  baseURL: config.baseURLApi,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || error.message;
    toast.error(message);
    return Promise.reject(error);
  }
);

const getGigApplications = (gigId) => {
  return apiClient.get(`/gigs/${gigId}/applications`);
};

const acceptApplication = (applicationId) => {
  return apiClient.post(`/applications/${applicationId}/accept`);
};

const rejectApplication = (applicationId) => {
  return apiClient.post(`/applications/${applicationId}/reject`);
};

const getDocuments = (userId) => {
  return apiClient.get(`/profile/documents/${userId}`);
};

const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('document', file);
  return apiClient.post('/profile/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const createGig = (gigData) => {
  return apiClient.post('/gigs', gigData);
};

const getGigs = () => {
  return apiClient.get('/gigs');
};

const getGigById = (gigId) => {
  return apiClient.get(`/gigs/${gigId}`);
};

const updateGig = (gigId, gigData) => {
  return apiClient.put(`/gigs/${gigId}`, gigData);
};

const searchGigs = (query) => {
  return apiClient.get(`/gigs/search?q=${encodeURIComponent(query)}`);
};

const applyToGig = (gigId) => {
  return apiClient.post(`/gigs/${gigId}/apply`);
};

const createOffering = (offeringData) => {
  return apiClient.post('/offerings', offeringData);
};

const getOfferings = () => {
  return apiClient.get('/offerings');
};

const getOffering = (id) => {
  return apiClient.get(`/offerings/${id}`);
};

const getMyOfferings = () => {
  return apiClient.get('/offerings/my-offerings');
};

const updateOffering = (id, offeringData) => {
  return apiClient.put(`/offerings/${id}`, offeringData);
};

const deleteOffering = (id) => {
  return apiClient.delete(`/offerings/${id}`);
};

const getConversations = () => {
  return apiClient.get('/inbox/conversations');
};

const getMessages = (conversationId) => {
  return apiClient.get(`/inbox/conversations/${conversationId}`);
};

const createConversation = (conversationData) => {
  return apiClient.post('/inbox/conversations', conversationData);
};

const sendMessage = (messageData) => {
  return apiClient.post('/inbox/messages', messageData);
};

const getNotifications = () => {
  return apiClient.get('/notifications');
};

const markAsRead = (notificationId) => {
  return apiClient.post(`/notifications/${notificationId}/mark-read`);
};

const requestDocumentVerification = (documentId) => {
  return apiClient.post(`/documents/${documentId}/verify`);
};

const getUserProfile = (userId) => {
  return apiClient.get(`/users/${userId}/profile`);
};

// Get current user's profile
const getCurrentUser = () => {
  return apiClient.get('/users/me');
};

// Get current user's applications
const getUserApplications = () => {
  return apiClient.get('/users/me/applications');
};

// Profile management
const updateUserProfile = (profileData) => {
  return apiClient.put('/users/me', profileData);
};

// New profile management endpoints
const updateProfile = (profileData) => {
  return apiClient.put('/profile/update', profileData);
};

const completeOnboarding = () => {
  return apiClient.post('/profile/onboarding/complete');
};

const completeProfile = () => {
  return apiClient.post('/profile/complete');
};

// Skills endpoints
const getSkills = () => {
  return apiClient.get('/users/me/upskill');
};

const addSkill = (skillData) => {
  return apiClient.post('/users/me/upskill', skillData);
};

// Education endpoints  
const getEducation = () => {
  return apiClient.get('/profile/education');
};

const addEducation = (educationData) => {
  return apiClient.post('/profile/education', educationData);
};

// Publications endpoints
const getPublications = () => {
  return apiClient.get('/profile/publications');
};

const addPublication = (publicationData) => {
  return apiClient.post('/profile/publications', publicationData);
};

// Payments endpoints
const getPayments = () => {
  return apiClient.get('/users/me/payments');
};

const updatePayments = (paymentData) => {
  return apiClient.put('/users/me/payments', paymentData);
};

// User documents
const getUserDocuments = () => {
  return apiClient.get('/users/me/documents');
};

// Agreements endpoints
const getAgreements = () => {
  return apiClient.get('/users/me/agreements');
};

// Transactions endpoints  
const getTransactions = () => {
  return apiClient.get('/users/me/transactions');
};

const checkApplicationStatus = (gigId) => {
  return apiClient.get(`/gigs/${gigId}/application-status`);
};

const getMyGigs = () => {
  return apiClient.get('/gigs/my-gigs');
};

const api = {
  getGigApplications,
  acceptApplication,
  rejectApplication,
  checkApplicationStatus,
  getDocuments,
  uploadDocument,
  createGig,
  getGigs,
  getMyGigs,
  getGigById,
  updateGig,
  searchGigs,
  applyToGig,
  createOffering,
  getOfferings,
  getOffering,
  getMyOfferings,
  updateOffering,
  deleteOffering,
  getConversations,
  getMessages,
  createConversation,
  sendMessage,
  getNotifications,
  markAsRead,
  requestDocumentVerification,
  getUserProfile,
  getCurrentUser,
  getUserApplications,
  updateUserProfile,
  updateProfile,
  completeOnboarding,
  completeProfile,
  // Skills/Upskill
  getSkills,
  addSkill,
  // Education
  getEducation,
  addEducation,
  // Publications
  getPublications,
  addPublication,
  // Payments
  getPayments,
  updatePayments,
  // Documents
  getUserDocuments,
  // Agreements
  getAgreements,
  // Transactions
  getTransactions,
  // Notifications  
  getNotifications,
  markAsRead,
};

export default api;