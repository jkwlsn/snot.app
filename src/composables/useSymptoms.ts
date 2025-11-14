import { type Ref, ref } from "vue";
import { db } from "../db";
import { liveQuery } from "dexie";
import { type SymptomRecord } from "../interfaces/SymptomRecord";

const symptoms = ref<SymptomRecord[]>([]);

liveQuery(() => db.symptoms.orderBy("timestamp").toArray()).subscribe(
  (updatedSymptoms: SymptomRecord[]) => {
    symptoms.value = updatedSymptoms;
  },
);

export function useSymptoms(): { symptoms: Ref<SymptomRecord[]> } {
  return { symptoms };
}
