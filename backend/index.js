require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const workoutRoutes = require('./routes/workout.routes');

const app = express();

// Middleware to allow cross-origin requests and parse JSON
app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// A simple test route to make sure the server is alive
app.get('/api/health', (req, res) => {
    res.send({ status: 'ok', message: 'FitFlow Backend is running!'});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

