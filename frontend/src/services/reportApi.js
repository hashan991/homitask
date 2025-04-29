import axios from "axios";

const API_URL = "http://localhost:8070/api/report"; // Adjust if backend runs on different port

export const fetchReport = async () => {
  const response = await axios.post(API_URL);
  return response.data;
};
