import { ref, type Ref } from "vue";
import { liveQuery } from "dexie";
import { db } from "../db";
import { type SymptomRecord } from "../interfaces/SymptomRecord";

const symptoms = ref<SymptomRecord[]>([]);

async function deleteSymptom(id: number): Promise<number> {
  await db.symptoms.delete(id);
  return id;
}

liveQuery(() => db.symptoms.toArray()).subscribe(
  (updatedSymptoms: SymptomRecord[]) => {
    symptoms.value = updatedSymptoms.reverse();
  },
);

export function useSymptoms(): {
  symptoms: Ref<SymptomRecord[]>;
  deleteSymptom: (id: number) => Promise<number>;
} {
  return { deleteSymptom, symptoms };
}
