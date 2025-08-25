const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  
  // Clear existing data to prevent duplicates
  await prisma.exercise.deleteMany();
  await prisma.equipment.deleteMany();
  console.log('Cleared previous data.');

  // 1. Create all Equipment types
  const equipmentData = [
    // Free / Common Items
    { name: 'Bodyweight' },
    { name: 'Mat / Towel' },
    { name: 'Bench / Chair' },
    { name: 'Wall' },
    { name: 'Backpack (Loaded)' },
    { name: 'Water Bottles / Jugs' },
    // Premium / Purchased Items
    { name: 'Resistance Bands' },
    { name: 'Dumbbells' },
    { name: 'Kettlebell' },
  ];

  await prisma.equipment.createMany({
    data: equipmentData,
  });
  console.log('Created equipment types.');

  // 2. Get the IDs of the equipment we just created for linking
  const allEquipment = await prisma.equipment.findMany();
  const equipmentMap = allEquipment.reduce((map, equipment) => {
    map[equipment.name] = equipment.id;
    return map;
  }, {});

  // 3. Create Exercises and link them to the correct equipment
  const exerciseData = [
    // Bodyweight
    { name: 'Push-up', equipmentId: equipmentMap['Bodyweight'] },
    { name: 'Air Squat', equipmentId: equipmentMap['Bodyweight'] },
    { name: 'Jumping Jacks', equipmentId: equipmentMap['Bodyweight'] },
    { name: 'Burpee', equipmentId: equipmentMap['Bodyweight'] },
    
    // Mat / Towel
    { name: 'Plank', equipmentId: equipmentMap['Mat / Towel'] },
    { name: 'Sit-up', equipmentId: equipmentMap['Mat / Towel'] },
    { name: 'Glute Bridge', equipmentId: equipmentMap['Mat / Towel'] },
    { name: 'Crunches', equipmentId: equipmentMap['Mat / Towel'] },

    // Bench / Chair
    { name: 'Tricep Dips', equipmentId: equipmentMap['Bench / Chair'] },
    { name: 'Step-Ups', equipmentId: equipmentMap['Bench / Chair'] },
    { name: 'Incline Push-ups', equipmentId: equipmentMap['Bench / Chair'] },
    { name: 'Bulgarian Split Squats', equipmentId: equipmentMap['Bench / Chair'] },

    // Wall
    { name: 'Wall Sit', equipmentId: equipmentMap['Wall'] },
    { name: 'Wall Push-up', equipmentId: equipmentMap['Wall'] },

    // Backpack (Loaded)
    { name: 'Backpack Squat', equipmentId: equipmentMap['Backpack (Loaded)'] },
    { name: 'Backpack Bent-Over Row', equipmentId: equipmentMap['Backpack (Loaded)'] },

    // Water Bottles / Jugs
    { name: 'Water Bottle Lateral Raise', equipmentId: equipmentMap['Water Bottles / Jugs'] },
    { name: 'Water Bottle Bicep Curl', equipmentId: equipmentMap['Water Bottles / Jugs'] },

    // --- Premium Exercises ---
    // Resistance Bands
    { name: 'Banded Pull-Apart', equipmentId: equipmentMap['Resistance Bands'] },
    { name: 'Banded Bicep Curl', equipmentId: equipmentMap['Resistance Bands'] },
    { name: 'Banded Glute Kickback', equipmentId: equipmentMap['Resistance Bands'] },

    // Dumbbells
    { name: 'Dumbbell Bicep Curl', equipmentId: equipmentMap['Dumbbells'] },
    { name: 'Dumbbell Bench Press', equipmentId: equipmentMap['Dumbbells'] },
    { name: 'Dumbbell Goblet Squat', equipmentId: equipmentMap['Dumbbells'] },

    // Kettlebell
    { name: 'Kettlebell Swing', equipmentId: equipmentMap['Kettlebell'] },
    { name: 'Kettlebell Goblet Squat', equipmentId: equipmentMap['Kettlebell'] },
  ];

  await prisma.exercise.createMany({
    data: exerciseData,
  });
  console.log('Created exercises.');
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });