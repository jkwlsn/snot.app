import { ref, computed } from "vue";
import type { DataTableRow } from "../interfaces/DataTable";
import type { Ref, ComputedRef } from "vue";

export function useDataTableSorting(
  records: Ref<DataTableRow[]>,
  columns: Ref<string[]>
): {
  sortKey: Ref<string>;
  sortOrders: Ref<Record<string, number>>;
  sortedRecords: ComputedRef<DataTableRow[]>;
  sortBy: (key: string) => void;
} {
  const initialSortKey = columns.value[0];
  const sortKey = ref(initialSortKey);

  const sortOrders = ref<Record<string, number>>(
    columns.value.reduce((o, key) => ({
      ...o,
      [key]: key === initialSortKey ? -1 : 1
    }), {})
  );

  const sortedRecords = computed(() => {
    const key = sortKey.value;
    if (!key) {
      return [...records.value];
    }
    const order = sortOrders.value[key];
    return [...records.value].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      // Handle null values: nulls go to the end
      if (valA === null && valB === null) return 0;
      if (valA === null) return order;
      if (valB === null) return -order;

      // Case-insensitive string comparison
      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA === valB) {
        return 0;
      }
      return (valA > valB ? 1 : -1) * order;
    });
  });

  function sortBy(key: string): void {
    sortKey.value = key;
    sortOrders.value[key] *= -1;
  }

  return { sortBy, sortKey, sortOrders, sortedRecords };
}
