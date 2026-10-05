import { createContext } from "svelte";
import type { LocationService, LocationState } from "./types";

export const [getLocationService, setLocationService] = createContext<LocationService>();

export const [getLocationState, setLocationState] = createContext<LocationState>();
