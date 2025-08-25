const express = require('express');
const { generateWorkout } = require('../controllers/workout.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// We will protect this route later in step 4
router.post('/generate', generateWorkout);

module.exports = router;