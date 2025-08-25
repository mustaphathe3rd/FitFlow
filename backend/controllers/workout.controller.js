const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Main function to generate the workout
exports.generateWorkout = async (req, res) => {

    const { durationInMinutes, equipmentNames } = req.body;

    if (!durationInMinutes || !equipmentNames || equipmentNames.length === 0) {
        return res.status(400).json({ message: "Missing duration or equipment." });
    }

    try {
        // 1. Fetch available exercises from your database based on user's equipment
        const availableExercises = await prisma.exercise.findMany({
            where: {
                equipment: {
                    name: {
                        in: equipmentNames,
                    },
                },
            },
            select: {
                name: true,
                // You can add other fields like 'description' here if you want the AI to consider them
            }
        });

        if (availableExercises.length === 0) {
            return res.status(404).json({ message: "No exercises found for the selected equipment." });
        }

        // Convert the list of exercises to a simple string for the prompt
        const exerciseListString = availableExercises.map(ex => ex.name).join(', ');

        // 2. Create a detailed prompt for the Gemini model
        const prompt = `
            You are a world-class fitness trainer creating a workout plan.
            The user wants a workout that is approximately ${durationInMinutes} minutes long.
            The user has access to the following equipment: ${equipmentNames.join(', ')}.
            
            Create a balanced workout routine using ONLY the exercises from this list: ${exerciseListString}.
            
            The final output must be a valid JSON object. Do not include any text, code block formatting, or explanations outside of the JSON object itself.
            The JSON object must have two properties:
            1. "name": A creative and motivating title for the workout (e.g., "Full Body Blast", "Core Crusher").
            2. "exercises": An array of objects. Each object should represent one exercise in the workout and must include these properties:
               - "name": The name of the exercise from the provided list.
               - "sets": The number of sets (e.g., 3).
               - "reps": The number of repetitions or duration (e.g., "10-12 reps", "45 seconds").
               
            Make sure the sequence of exercises makes sense (e.g., warm-up, main exercises, cool-down if appropriate).
        `;

        // 3. Call the Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 4. Parse the AI response and send it back to the client
        try {
            const workoutPlan = JSON.parse(text);
            res.status(200).json(workoutPlan);
        } catch (parseError) {
            console.error("Failed to parse JSON from Gemini:", text);
            res.status(500).json({ message: "Error processing the workout plan from the AI." });
        }

    } catch (error) {
        console.error("Error in generateWorkout:", error);
        res.status(500).json({ message: 'Failed to generate workout', error: error.message });
    }
};