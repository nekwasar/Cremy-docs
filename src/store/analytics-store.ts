import { create } from 'zustand';

interface AnalyticsState {
  dateRange: string;
  selectedMetric: string | null;
  comparisonMode: boolean;
  isLoading: boolean;
  overview: any;
  funnel: any;
  errors: any;
  setDateRange: (range: string) => void;
  setSelectedMetric: (metric: string | null) => void;
  setComparisonMode: (mode: boolean) => void;
  setLoading: (loading: boolean) => void;
  setData: (overview: any, funnel: any, errors: any) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dateRange: '30d',
  selectedMetric: null,
  comparisonMode: false,
  isLoading: false,
  overview: {},
  funnel: {},
  errors: {},
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedMetric: (metric) => set({ selectedMetric: metric }),
  setComparisonMode: (mode) => set({ comparisonMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  setData: (overview, funnel, errors) => set({ overview, funnel, errors, isLoading: false }),
}));