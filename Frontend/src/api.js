// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cartify-uapn.onrender.com/api",
  // baseURL: "http://localhost:3000/api",

  withCredentials: true
});

export default API;
