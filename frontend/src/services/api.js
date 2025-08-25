import axios from 'axios';

// IMPORTANT: If testing on a physical device, replace 'localhost' with your computer's local IP address.
// You can find your IP address by running 'ifconfig' (macOS/Linux) or 'ipconfig' (Windows) in your terminal.
const API_URL = 'https://d6877ffa7072.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_URL,
});

const AI_API_URL = 'http://192.168.76.155:5001'; // <-- Replace with your IP if different

export const aiApi = axios.create({
    baseURL: AI_API_URL,
});


export default api;