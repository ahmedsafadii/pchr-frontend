"use client";

import { ReactNode, useEffect } from "react";
import { useConstantsStore } from "../store/constants.store";

export default function ClientProviders({ children, locale }: { children: ReactNode; locale: string }) {
  const { constants, loadConstants, isLoading } = useConstantsStore();

  useEffect(() => {
    if (!constants && !isLoading) {
      void loadConstants(locale);
    }
  }, [constants, isLoading, loadConstants, locale]);

  return <>{children}</>;
}


