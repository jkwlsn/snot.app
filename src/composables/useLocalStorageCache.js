import { ref } from 'vue';

export function useLocalStorageCache(key, initialValue, ttl) {
  const cachedData = ref(initialValue);

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { timestamp, data } = JSON.parse(raw);
      if (ttl && Date.now() - timestamp > ttl) {
        return null; // Cache expired
      }
      cachedData.value = data;
      return { timestamp, data };
    } catch {
      return null;
    }
  }

  function saveToStorage(data) {
    localStorage.setItem(
      key,
      JSON.stringify({ timestamp: Date.now(), data }),
    );
    cachedData.value = data;
  }

  function clearCache() { // Renamed from clearStorage
    localStorage.removeItem(key);
    cachedData.value = initialValue;
  }

  return {
    cachedData,
    loadFromStorage,
    saveToStorage,
    clearCache, // Renamed export
  };
}