// Temporal graph interfaces
export interface TemporalDataPoint {
	timestamp: Date;
	value: number;
}

export interface LabelledDataPoint {
	label: string;
	value: number;
}

export interface GraphProvider<TIn, TOut> {
	transform(records: TIn[]): TOut[];
}
