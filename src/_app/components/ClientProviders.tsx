"use client";

import { ReactNode, useEffect, useCallback, useRef } from "react";
import { useConstantsStore } from "../store/constants.store";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({ children, locale }: { children: ReactNode; locale: string }) {
  const { constants, loadConstants, isLoading } = useConstantsStore();
  const hasAttemptedLoad = useRef(false);

  // Memoize the load function to prevent infinite re-renders
  const handleLoadConstants = useCallback(async () => {
    if (!hasAttemptedLoad.current) {
      hasAttemptedLoad.current = true;
      try {
        await loadConstants(locale);
      } catch (err) {
        console.error('Failed to load constants:', err);
      }
    }
  }, [loadConstants, locale]);

  useEffect(() => {
    // Only load constants if we don't have them and haven't attempted to load yet
    if (!constants && !isLoading && !hasAttemptedLoad.current) {
      void handleLoadConstants();
    }
  }, [constants, isLoading, handleLoadConstants]);

  // Reset when locale changes
  useEffect(() => {
    hasAttemptedLoad.current = false;
  }, [locale]);

  return (
    <>
      {children}
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </>
  );
}


