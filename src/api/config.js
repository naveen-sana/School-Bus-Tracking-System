import axios from "axios";

const config = axios.create({
  baseURL: "/api/v1/",
  withCredentials: true,
});

export default config;