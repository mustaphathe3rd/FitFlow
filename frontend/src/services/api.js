import axios from 'axios';

// IMPORTANT: If testing on a physical device, replace 'localhost' with your computer's local IP address.
// You can find your IP address by running 'ifconfig' (macOS/Linux) or 'ipconfig' (Windows) in your terminal.
const API_URL = 'https://f1a19acefe1d.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;