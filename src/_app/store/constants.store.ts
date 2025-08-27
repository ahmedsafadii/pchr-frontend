"use client";

import { create } from "zustand";
import { fetchPublicConstants, type ApiResponse } from "../services/api";

type ConstantsState = {
  constants: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
  lastLocaleLoaded: string | null;
  inFlightLocale: string | null;
  failedAttempts: number;
  lastFailedAttempt: number | null;
  loadConstants: (lang: string) => Promise<void>;
  setConstants: (data: ApiResponse) => void;
};

const MAX_RETRY_ATTEMPTS = 5;
const BASE_COOLDOWN_MS = 1000; // 1 second base cooldown

export const useConstantsStore = create<ConstantsState>((set, get) => ({
  constants: null,
  isLoading: false,
  error: null,
  lastLocaleLoaded: null,
  inFlightLocale: null,
  failedAttempts: 0,
  lastFailedAttempt: null,
  setConstants: (data) => set({ constants: data, error: null, failedAttempts: 0, lastFailedAttempt: null }),
  loadConstants: async (lang: string) => {
    const state = get();
    
    // Do not refetch if we already have constants for this locale
    if (state.constants !== null && state.lastLocaleLoaded === lang) {
      return;
    }
    
    // Avoid duplicate in-flight requests for the same locale
    if (state.isLoading && state.inFlightLocale === lang) {
      return;
    }
    
    // Check if we've exceeded maximum retry attempts
    if (state.failedAttempts >= MAX_RETRY_ATTEMPTS) {
      const message = `Failed to load constants after ${MAX_RETRY_ATTEMPTS} attempts. Please check your connection and try again later.`;
      set((state) => ({
        ...state,
        error: message,
        isLoading: false,
        inFlightLocale: null
      }));
      console.warn(`Constants request blocked: maximum retry attempts (${MAX_RETRY_ATTEMPTS}) exceeded`);
      return;
    }
    
    // Check if we should throttle due to recent failures
    const now = Date.now();
    const cooldownPeriod = Math.min(BASE_COOLDOWN_MS * Math.pow(2, state.failedAttempts), 30000); // Exponential backoff, max 30s
    
    if (state.lastFailedAttempt && (now - state.lastFailedAttempt) < cooldownPeriod) {
      console.log(`Constants request throttled. Cooldown period: ${cooldownPeriod}ms`);
      return;
    }
    
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      inFlightLocale: lang
    }));
    
    try {
      const data = await fetchPublicConstants(lang);
      set((state) => ({
        ...state,
        constants: data,
        isLoading: false,
        error: null,
        lastLocaleLoaded: lang,
        inFlightLocale: null,
        failedAttempts: 0,
        lastFailedAttempt: null
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load constants";
      const newFailedAttempts = state.failedAttempts + 1;
      
      set((state) => ({
        ...state,
        error: message,
        isLoading: false,
        inFlightLocale: null,
        failedAttempts: newFailedAttempts,
        lastFailedAttempt: now
      }));
      
      console.warn(`Constants request failed (attempt ${newFailedAttempts}/${MAX_RETRY_ATTEMPTS}):`, message);
    }
  },
}));


