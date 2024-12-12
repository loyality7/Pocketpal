export type BenchmarkConfig = {
  pp: number;
  tg: number;
  pl: number;
  nr: number;
  label: string;
};

export type BenchmarkResult = {
  config: BenchmarkConfig;
  modelDesc: string;
  modelSize: number;
  modelNParams: number;
  ppAvg: number;
  ppStd: number;
  tgAvg: number;
  tgStd: number;
  timestamp: string;
  modelId: string;
  peakMemoryUsage?: {
    total: number;
    used: number;
    percentage: number;
  };
  wallTimeMs?: number;
};
