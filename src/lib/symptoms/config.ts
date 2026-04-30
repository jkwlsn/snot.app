export const SYMPTOMS = [
	{ name: 'nose', description: 'Nasal congestion or runny nose' },
	{ name: 'eyes', description: 'Eye irritation or watering' },
	{ name: 'throat', description: 'Throat soreness or irritation' },
	{ name: 'breathing', description: 'Difficulty breathing' }
] as const;

export const SEVERITY_LEVELS = [0, 1, 2, 3, 4, 5] as const;
