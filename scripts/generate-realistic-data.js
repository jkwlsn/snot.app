import { getUnixTime, addDays, subYears, setHours, setMinutes, getDayOfYear, getDay, getMonth, getFullYear, getDate, getHours, getMinutes, setDate, setMonth, setFullYear, startOfDay } from "date-fns";
import { UTCDate } from "@date-fns/utc";

// This script is designed to be run in the browser's developer console
// for the snot.app application. It deletes all existing symptom data
// and generates a year's worth of realistic, multi-layered seasonal hay fever data
// using a smooth, curve-based seasonal model.
// Each symptom record will contain realistic pollen levels for that day.
//
// This script is a module and uses top-level await. It will work in modern browsers
// that support these features in their developer consoles.
//
// To use:
// 1. Run the application in development mode (npm run dev).
// 2. Open the application in your browser.
// 3. Open the developer console (usually F12 or Ctrl+Shift+I).
// 4. Copy the entire content of this file and paste it into the console.
// 5. Press Enter.

(async () => {
  const { db } = await import("/src/db.ts");

  // --- Configuration ---
  const symptomTypes = [
    "Sneezing",
    "Snotty nose",
    "Sore throat",
    "Coughing",
    "Itchy eyes",
    "Headaches",
    "Tiredness",
  ];
  const pollenTypes = [
    "alder_pollen",
    "birch_pollen",
    "grass_pollen",
    "mugwort_pollen",
    "olive_pollen",
    "ragweed_pollen",
  ];

  // --- Curve-Based Seasonal Model ---
  const pollenCurves = [
    { name: "alder_pollen", peak: 75, width: 30, amplitude: 0.5, maxCount: 90 },
    {
      name: "birch_pollen",
      peak: 105,
      width: 45,
      amplitude: 1.0,
      maxCount: 220,
    },
    {
      name: "grass_pollen",
      peak: 165,
      width: 60,
      amplitude: 0.9,
      maxCount: 180,
    },
    {
      name: "mugwort_pollen",
      peak: 200,
      width: 40,
      amplitude: 0.7,
      maxCount: 110,
    },
    {
      name: "ragweed_pollen",
      peak: 240,
      width: 35,
      amplitude: 0.6,
      maxCount: 140,
    },
    {
      name: "olive_pollen",
      peak: 150,
      width: 30,
      amplitude: 0.1,
      maxCount: 40,
    },
  ];

  const gaussian = (day, peak, width, amplitude) => {
    return amplitude * Math.exp(-((day - peak) ** 2) / (2 * width ** 2));
  };

  const getDailyPollenLevels = (dayOfYear) => {
    const levels = {};
    for (const type of pollenTypes) {
      levels[type] = 0;
    }

    for (const curve of pollenCurves) {
      const score = gaussian(
        dayOfYear,
        curve.peak,
        curve.width,
        curve.amplitude,
      );
      const count = Math.round(
        score * curve.maxCount * (Math.random() * 0.4 + 0.8),
      ); // Add 20% randomness
      levels[curve.name] = count;
    }
    return levels;
  };

  // --- Helper Functions ---
  const createSymptomRecord = (date, dayBaseSeverity, dailyPollenLevels) => {
    const randomType =
      symptomTypes[Math.floor(Math.random() * symptomTypes.length)];

    const hour = Math.floor(Math.random() * 24);
    const timestamp = setMinutes(setHours(date, hour), Math.floor(Math.random() * 60));

    let finalSeverity = dayBaseSeverity;
    if (hour >= 6 && hour < 12) {
      finalSeverity += Math.random() * 1.5;
    } // Morning peak
    else if (hour >= 18 && hour < 22) {
      finalSeverity += Math.random() * 1;
    } // Evening peak
    finalSeverity += (Math.random() - 0.5) * 2; // Add more randomness
    const severity = Math.max(1, Math.min(5, Math.round(finalSeverity)));

    const location = {
      latitude: 52.52 + (Math.random() - 0.5) * 0.05,
      longitude: 13.4 + (Math.random() - 0.5) * 0.05,
    };

    const pollenData = [
      {
        timestamp: timestamp.toISOString(),
        levels: dailyPollenLevels,
      },
    ];

    return { type: randomType, severity, timestamp, location, pollenData };
  };

  // --- Main Execution ---
  try {
    console.log("Deleting all existing symptom data...");
    await db.symptoms.clear();
    console.log("Existing data cleared.");

    console.log(
      "Generating 1 year of realistic data with associated pollen levels...",
    );
    const today = new UTCDate();
    const oneYearAgo = subYears(today, 1);
    
    const startDayOfYear = getDayOfYear(oneYearAgo);

    const recordsToAdd = [];

    for (let i = 0; i < 365; i++) {
      const day = startOfDay(addDays(oneYearAgo, i));
      
      const dayOfYear = (startDayOfYear + i) % 365;
      const dayOfWeek = getDay(day);

      const dailyPollenLevels = getDailyPollenLevels(dayOfYear);
      const totalPollenScore =
        Object.values(dailyPollenLevels).reduce((a, b) => a + b, 0) / 780; // Normalize score

      let dayBaseSeverity = 1 + totalPollenScore * 4;
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayBaseSeverity += 0.3;
      }

      const maxSymptomsForDay = Math.round(totalPollenScore * 100);
      const numSymptomsToday = Math.round(
        maxSymptomsForDay * (Math.random() * 0.8 + 0.6),
      );

      if (numSymptomsToday > 0) {
        for (let j = 0; j < numSymptomsToday; j++) {
          recordsToAdd.push(
            createSymptomRecord(
              day,
              dayBaseSeverity,
              dailyPollenLevels,
            ),
          );
        }
      }
    }

    await db.symptoms.bulkAdd(recordsToAdd);

    console.log(
      `Successfully generated and added ${recordsToAdd.length} realistic symptom records.`,
    );
    console.log("The symptom graphs and logs should update automatically.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
