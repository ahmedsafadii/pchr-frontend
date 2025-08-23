"use client";

import { ReactNode, useEffect } from "react";
import { useConstantsStore } from "../store/constants.store";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({ children, locale }: { children: ReactNode; locale: string }) {
  const { constants, loadConstants, isLoading } = useConstantsStore();

  useEffect(() => {
    if (!constants && !isLoading) {
      void loadConstants(locale);
    }
  }, [constants, isLoading, loadConstants, locale]);

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


