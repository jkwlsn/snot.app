import type { SymptomRecord } from "../interfaces/SymptomRecord";

// Helper function to aggregate symptoms by day
export function aggregateSymptomsByDay<T>(
  symptomRecords: SymptomRecord[],
  createInitialValue: () => T, // Change to factory function
  aggregator: (current: T, symptom: SymptomRecord) => T,
): Map<string, T> {
  const aggregatedData = new Map<string, T>();
  for (const symptom of symptomRecords) {
    const date = symptom.timestamp.toISOString().split("T")[0];
    const current = aggregatedData.has(date)
      ? aggregatedData.get(date)!
      : createInitialValue(); // Call the factory function
    aggregatedData.set(date, aggregator(current, symptom));
  }
  return aggregatedData;
}