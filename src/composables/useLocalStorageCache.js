import { ref } from 'vue';

export function useLocalStorageCache(key, initialValue, ttl) {
  const cachedData = ref(initialValue);

  function loadFromStorage() {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if cache is still valid based on TTL
      if (ttl && parsed.timestamp && Date.now() - parsed.timestamp < ttl) {
        cachedData.value = parsed;
      } else {
        // Cache expired or no TTL, clear it
        clearCache();
      }
    }
  }

  function saveToStorage(data) {
    localStorage.setItem(key, JSON.stringify({ ...data, timestamp: Date.now() }));
    cachedData.value = data;
  }

  function clearCache() {
    localStorage.removeItem(key);
    cachedData.value = initialValue;
  }

  return {
    cachedData,
    loadFromStorage,
    saveToStorage,
    clearCache,
  };
}