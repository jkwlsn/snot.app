import type { LocationState, UserLocation } from "./types";

export function createLocationState(): LocationState {
  let currentLocation = $state<UserLocation | null>(null);
  let searchResults = $state<UserLocation[]>([]);

  return {
    get currentLocation() {
      return currentLocation;
    },
    get searchResults() {
      return searchResults;
    },
    setCurrentLocation(location: UserLocation | null) {
      currentLocation = location;
    },
    setSearchResults(results: UserLocation[]) {
      searchResults = results;
    },
    clearCurrentLocation() {
      currentLocation = null;
    },
    clearSearchResults() {
      searchResults = [];
    },
  };
}
