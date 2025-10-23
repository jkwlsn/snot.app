export interface ChartDataset {
  label: string;
  data: { x: string; y: number }[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}
