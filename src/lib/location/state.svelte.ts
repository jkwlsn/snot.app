export const currentLocation = $state<Location | null>(null);

export const isGettingLocation = $state<boolean>(false);

export const locationError = $state<string | null>(null);

export const locationSearchResults = $state<Location[]>([]);
