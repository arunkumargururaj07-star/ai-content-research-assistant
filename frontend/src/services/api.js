import axios from "axios";

const API = "http://127.0.0.1:8000";

export const uploadPDF = (formData) =>
  axios.post(`${API}/upload`, formData);

export const askQuestion = (question) =>
  axios.post(`${API}/ask`, { question });

export const summarize = () =>
  axios.post(`${API}/summarize`, {});

export const generateIdeas = (topic) =>
  axios.post(`${API}/generate-ideas`, {
    prompt: topic,
  });

export const generateLinkedIn = (topic) =>
  axios.post(`${API}/linkedin`, {
    prompt: topic,
  });

export const generateBlog = (topic) =>
  axios.post(`${API}/blog`, {
    prompt: topic,
  });

export const generateYoutube = (topic) =>
  axios.post(`${API}/youtube`, {
    prompt: topic,
  });

export const generateHashtags = (topic) =>
  axios.post(`${API}/hashtags`, {
    prompt: topic,
  });

export const getStats = () =>
  axios.get(`${API}/stats`);