import axios from "axios";

const SERVER_URL = process.env.SERVER_URL;

export const axiosInstance = axios.create({
    baseURL: SERVER_URL || "http://localhost:5100/api/v1",
    withCredentials: true, // send cookies when cross-domain requests are made
    headers: {
      "Content-Type": "application/json",
    },
  });