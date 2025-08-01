require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware to allow cross-origin requests and parse JSON
app.use(cors())
app.use(express.json());

// A simple test route to make sure the server is alive
app.get('/api/health', (req, res) => {
    res.send({ status: 'ok', message: 'FitFlow Backend is running!'});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

