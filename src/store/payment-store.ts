import { create } from 'zustand';
import type { ProcessorName } from '@/config/payment';

interface PaymentState {
  currentPlan: 'free' | 'pro_monthly' | 'pro_yearly';
  paymentMethod: ProcessorName | null;
  subscriptionId: string | null;
  billingDate: Date | null;
  isProcessing: boolean;
  error: string | null;
  setPlan: (plan: 'free' | 'pro_monthly' | 'pro_yearly') => void;
  setPaymentMethod: (method: ProcessorName | null) => void;
  setSubscriptionId: (id: string | null) => void;
  setBillingDate: (date: Date | null) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  currentPlan: 'free',
  paymentMethod: null,
  subscriptionId: null,
  billingDate: null,
  isProcessing: false,
  error: null,
  setPlan: (plan) => set({ currentPlan: plan }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setSubscriptionId: (id) => set({ subscriptionId: id }),
  setBillingDate: (date) => set({ billingDate: date }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setError: (error) => set({ error }),
  reset: () => set({ currentPlan: 'free', paymentMethod: null, subscriptionId: null, billingDate: null, error: null }),
}));