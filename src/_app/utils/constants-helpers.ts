import { useConstantsStore } from "../store/constants.store";
import { useMemo } from "react";

export function getDocumentTypeId(valueKey: string): string | null {
  const constants = useConstantsStore.getState().constants;
  const list = (constants?.data as any)?.document_types as Array<{
    id: string;
    name: string;
    value: string;
  }> | undefined;
  if (!list) return null;
  const match = list.find((d) => d.value === valueKey);
  return match?.id ?? null;
}

export function useDocumentTypeId(valueKey: string): string | null {
  const list = useConstantsStore((state) =>
    ((state.constants?.data as any)?.document_types as Array<{
      id: string;
      name: string;
      value: string;
    }> | undefined)
  );
  return useMemo(() => {
    if (!list) return null;
    const match = list.find((d) => d.value === valueKey);
    return match?.id ?? null;
  }, [list, valueKey]);
}


