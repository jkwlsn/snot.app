import { ref, onMounted, onBeforeUnmount } from "vue";
import { db } from "../db";
import { liveQuery } from "dexie";
import { SymptomRecord } from "../interfaces/SymptomRecord";

export function useSymptoms() {
  const symptoms = ref<SymptomRecord[]>([]);

  let liveSubscription: { unsubscribe: () => void } | null = null;

  const subscribeToLiveQuery = () => {
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
