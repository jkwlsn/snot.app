export const SYMPTOMS = [
	{ name: 'nose', description: 'Nasal congestion or runny nose' },
	{ name: 'eyes', description: 'Eye irritation or watering' },
	{ name: 'throat', description: 'Throat soreness or irritation' },
	{ name: 'breathing', description: 'Difficulty breathing' }
] as const;

export type SymptomName = (typeof SYMPTOMS)[number]['name'];
