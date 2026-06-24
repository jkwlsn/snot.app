import { createContext } from 'svelte';
import type { EntryService, EntryState } from './types';

export const [getEntryService, setEntryService] = createContext<EntryService>();

export const [getEntryState, setEntryState] = createContext<EntryState>();
