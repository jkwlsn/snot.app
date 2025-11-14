import { ref, type Ref } from "vue";
import { liveQuery } from "dexie";
import { db } from "../db";
import { type SymptomRecord } from "../interfaces/SymptomRecord";

const symptoms = ref<SymptomRecord[]>([]);

liveQuery(() => db.symptoms.toArray()).subscribe(
  (updatedSymptoms: SymptomRecord[]) => {
    symptoms.value = updatedSymptoms;
  },
);

export function useSymptoms(): { symptoms: Ref<SymptomRecord[]> } {
  return { symptoms };
}
