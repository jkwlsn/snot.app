import { z } from 'zod';

export const latLongSchema = z.object({ lat: z.number(), long: z.number() });
