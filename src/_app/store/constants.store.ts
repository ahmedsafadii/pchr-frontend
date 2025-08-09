"use client";

import { create } from "zustand";
import { fetchPublicConstants, type ApiResponse } from "../services/api";

type ConstantsState = {
  constants: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
  lastLocaleLoaded: string | null;
  inFlightLocale: string | null;
  loadConstants: (lang: string) => Promise<void>;
  setConstants: (data: ApiResponse) => void;
};

export const useConstantsStore = create<ConstantsState>((set) => ({
  constants: null,
  isLoading: false,
  error: null,
  lastLocaleLoaded: null,
  inFlightLocale: null,
  setConstants: (data) => set({ constants: data, error: null }),
  loadConstants: async (lang: string) => {
    let shouldFetch = true;
    set((state) => {
      // Do not refetch if we already have constants for this locale
      if (state.constants !== null && state.lastLocaleLoaded === lang) {
        shouldFetch = false;
        return state;
      }
      // Avoid duplicate in-flight requests for the same locale
      if (state.isLoading && state.inFlightLocale === lang) {
        shouldFetch = false;
        return state;
      }
      return { ...state, isLoading: true, error: null, inFlightLocale: lang };
    });

    if (!shouldFetch) return;
    try {
      const data = await fetchPublicConstants(lang);
      set({
        constants: data,
        isLoading: false,
        error: null,
        lastLocaleLoaded: lang,
        inFlightLocale: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load constants";
      set({ error: message, isLoading: false, inFlightLocale: null });
    }
  },
}));


