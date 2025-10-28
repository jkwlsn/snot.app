import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";
import { db } from "../db";
import { liveQuery } from "dexie";
import type { SymptomRecord } from "../interfaces/SymptomRecord";

export function useSymptoms(): { symptoms: Ref<SymptomRecord[]> } {
  const symptoms = ref<SymptomRecord[]>([]);

  let liveSubscription: { unsubscribe: () => void } | null = null;

  const subscribeToLiveQuery = (): void => {
    liveSubscription = liveQuery(() =>
      db.symptoms.orderBy("timestamp").toArray(),
    ).subscribe((updatedSymptoms: SymptomRecord[]) => {
      symptoms.value = updatedSymptoms;
    });
  };

  onMounted(() => {
    subscribeToLiveQuery();
  });

  onBeforeUnmount(() => {
    if (liveSubscription) {
      liveSubscription.unsubscribe();
    }
  });

  return { symptoms };
}
