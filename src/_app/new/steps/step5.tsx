"use client";

import { useState, useEffect, useCallback } from "react";
// Dropzone is handled inside Uploader component
import { CaseData } from "../page";
import { useTranslations } from "next-globe-gen";
import Uploader from "../../components/Uploader";

interface Step5Props {
  data: CaseData;
  updateData: (section: keyof CaseData, data: any) => void;
  onComplete: (stepNumber: number) => void;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  currentStep: number;
  totalSteps: number;
  locale?: string;
  completedSteps?: number[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file: File;
  status?: "uploading" | "uploaded" | "error";
}

export default function Step5({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  completedSteps = [],
}: Step5Props) {
  const t = useTranslations() as any;
  const [detaineeIdFiles, setDetaineeIdFiles] = useState<UploadedFile[]>([]);
  const [clientIdFiles, setClientIdFiles] = useState<UploadedFile[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFile[]>([]);
  // Document type keys to send directly instead of IDs
  const detaineeIdType = "detainee_id";
  const clientIdType = "client_id";
  const additionalType = "additional";

  // Helper to extract uploaded server ids
  const getUploadedIds = (files: any[]) => {
    if (!Array.isArray(files)) {
      console.warn("getUploadedIds: files is not an array", files);
      return [];
    }
    return files
      .filter((f) => f?.status === "uploaded" && typeof f?.id === "string")
      .map((f) => f.id as string);
  };

  const updateDocuments = useCallback((
    nextDetainee: UploadedFile[] = detaineeIdFiles,
    nextClient: UploadedFile[] = clientIdFiles,
    nextAdditional: UploadedFile[] = additionalFiles
  ) => {
    // Ensure all parameters are arrays
    const safeDetainee = Array.isArray(nextDetainee) ? nextDetainee : [];
    const safeClient = Array.isArray(nextClient) ? nextClient : [];
    const safeAdditional = Array.isArray(nextAdditional) ? nextAdditional : [];

    const detaineeId = getUploadedIds(safeDetainee)[0] ?? null;
    const clientId = getUploadedIds(safeClient)[0] ?? null;
    const additionalIds = getUploadedIds(safeAdditional);

    updateData("documents", {
      detainee_document_id: detaineeId,
      client_document_id: clientId,
      additional_document_ids: additionalIds,
    });
  }, [detaineeIdFiles, clientIdFiles, additionalFiles, updateData]);

  useEffect(() => {
    // Hydrate from existing documents data on mount/prop change
    const docs = data.documents;
    if (!docs) {
      return;
    }

    // If there is a known uploaded detainee_document_id OR metadata exists but local list is empty, show a placeholder entry
    const detaineeMeta = docs.display_meta?.detainee_id;
    const hasDetaineeData = docs.detainee_document_id || detaineeMeta?.id;

    if (hasDetaineeData && detaineeIdFiles.length === 0) {
      const hydratedFile = {
        id: detaineeMeta?.id ?? docs.detainee_document_id, // Use metadata ID first
        name: detaineeMeta?.name ?? "document.pdf",
        size: detaineeMeta?.size ?? 0,
        type: detaineeMeta?.type ?? "application/pdf",
        file: new File([new Blob()], detaineeMeta?.name ?? "document.pdf", {
          type: detaineeMeta?.type ?? "application/pdf",
        }),
        url: undefined,
        status: detaineeMeta?.status ?? "uploaded",
      } as any;

      setDetaineeIdFiles([hydratedFile]);

      // Also update the document_id if it's missing
      if (!docs.detainee_document_id && detaineeMeta?.id) {
        if (data.documents?.detainee_document_id !== detaineeMeta.id) {
          updateData("documents", {
            detainee_document_id: detaineeMeta.id,
          });
        }
      }
    } else {
    }

    // If there is a known uploaded client_document_id OR metadata exists but local list is empty, show a placeholder entry
    const clientMeta = docs.display_meta?.client_id;
    const hasClientData = docs.client_document_id || clientMeta?.id;

    if (hasClientData && clientIdFiles.length === 0) {
      const hydratedFile = {
        id: clientMeta?.id ?? docs.client_document_id, // Use metadata ID first
        name: clientMeta?.name ?? "document.pdf",
        size: clientMeta?.size ?? 0,
        type: clientMeta?.type ?? "application/pdf",
        file: new File([new Blob()], clientMeta?.name ?? "document.pdf", {
          type: clientMeta?.type ?? "application/pdf",
        }),
        url: undefined,
        status: clientMeta?.status ?? "uploaded",
      } as any;

      setClientIdFiles([hydratedFile]);

      // Also update the document_id if it's missing
      if (!docs.client_document_id && clientMeta?.id) {
        if (data.documents?.client_document_id !== clientMeta.id) {
          updateData("documents", {
            client_document_id: clientMeta.id,
          });
        }
      }
    } else {
    }

    // If there are additional document IDs OR additional metadata exists but local list is empty
    const additionalMetas = docs.display_meta?.additional ?? [];
    const hasAdditionalData =
      (Array.isArray(docs.additional_document_ids) &&
        docs.additional_document_ids.length > 0) ||
      additionalMetas.length > 0;

    if (hasAdditionalData && additionalFiles.length === 0) {
      // Use metadata IDs if document IDs array is empty
      const idsToUse =
        docs.additional_document_ids.length > 0
          ? docs.additional_document_ids
          : additionalMetas.map((m) => m.id);

      const hydratedFiles = idsToUse.map((id) => {
        const meta = additionalMetas.find((m) => m.id === id);
        return {
          id: meta?.id ?? id, // Use preserved server ID
          name: meta?.name ?? "document.pdf",
          size: meta?.size ?? 0,
          type: meta?.type ?? "application/pdf",
          file: new File([new Blob()], meta?.name ?? "document.pdf", {
            type: meta?.type ?? "application/pdf",
          }),
          url: undefined,
          status: meta?.status ?? "uploaded",
        } as any;
      });

      setAdditionalFiles(hydratedFiles);

      // Also update the document_ids if they're missing
      if (
        docs.additional_document_ids.length === 0 &&
        additionalMetas.length > 0
      ) {
        const nextIds = additionalMetas.map((m) => m.id);
        const prevIds = data.documents?.additional_document_ids || [];
        const sameLen = prevIds.length === nextIds.length;
        const sameVals = sameLen && prevIds.every((id, i) => id === nextIds[i]);
        if (!sameVals) {
          updateData("documents", {
            additional_document_ids: nextIds,
          });
        }
      }
    } else {
    }
  }, [
    data.documents,
    detaineeIdFiles.length,
    clientIdFiles.length,
    additionalFiles.length,
    updateData,
  ]);

  // Update documents when file states change
  useEffect(() => {
    // Only push ids when they truly changed compared to data.documents
    const nextDetaineeId = getUploadedIds(detaineeIdFiles)[0] ?? null;
    const nextClientId = getUploadedIds(clientIdFiles)[0] ?? null;
    const nextAdditionalIds = getUploadedIds(additionalFiles);

    const prevDocs = data.documents || ({} as any);
    const prevAdditional = prevDocs.additional_document_ids || [];
    const addSameLen = prevAdditional.length === nextAdditionalIds.length;
    const addSameVals = addSameLen && prevAdditional.every((id, i) => id === nextAdditionalIds[i]);

    const idsChanged =
      prevDocs.detainee_document_id !== nextDetaineeId ||
      prevDocs.client_document_id !== nextClientId ||
      !addSameVals;

    if (idsChanged) {
      updateDocuments(detaineeIdFiles, clientIdFiles, additionalFiles);
    }

    // Auto-complete step 5 when client ID is uploaded
    const hasClientId = nextClientId !== null;
    if (hasClientId && !completedSteps.includes(5)) {
      onComplete(5);
    }

    // Update display metadata for uploaded files
    const detaineeUploaded = detaineeIdFiles.find(
      (f) => f.status === "uploaded"
    );
    const clientUploaded = clientIdFiles.find((f) => f.status === "uploaded");
    const additionalUploaded = additionalFiles.filter(
      (f) => f.status === "uploaded"
    );

    // Always update display metadata to ensure it reflects current state
    const newDisplayMeta: any = {
      ...(data.documents?.display_meta || {}),
    };

    // Update detainee metadata
    if (detaineeUploaded) {
      newDisplayMeta.detainee_id = {
        id: detaineeUploaded.id,
        name: detaineeUploaded.name,
        size: detaineeUploaded.size,
        type: detaineeUploaded.type,
        status: detaineeUploaded.status || "uploaded",
      };
    } else if (detaineeIdFiles.length === 0) {
      // Remove detainee metadata if no files
      delete newDisplayMeta.detainee_id;
    }

    // Update client metadata
    if (clientUploaded) {
      newDisplayMeta.client_id = {
        id: clientUploaded.id,
        name: clientUploaded.name,
        size: clientUploaded.size,
        type: clientUploaded.type,
        status: clientUploaded.status || "uploaded",
      };
    } else if (clientIdFiles.length === 0) {
      // Remove client metadata if no files
      delete newDisplayMeta.client_id;
    }

    // Update additional metadata
    if (additionalUploaded.length > 0) {
      newDisplayMeta.additional = additionalUploaded.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        status: f.status || "uploaded",
      }));
    } else if (additionalFiles.length === 0) {
      // Remove additional metadata if no files
      delete newDisplayMeta.additional;
    }

    const prevDisplay = data.documents?.display_meta || {};
    const changed = JSON.stringify(prevDisplay) !== JSON.stringify(newDisplayMeta);
    if (changed) {
      updateData("documents", {
        display_meta: newDisplayMeta,
      });
    }
  }, [
    detaineeIdFiles,
    clientIdFiles,
    additionalFiles,
    data.documents,
    updateData,
    updateDocuments,
    completedSteps,
    onComplete,
  ]);

  const removeDetaineeIdFile = (fileId: string) => {
    setDetaineeIdFiles((prev) => {
      const filtered = prev.filter((file) => file.id !== fileId);
      // Clear the detainee document ID if we're removing the last file
      if (filtered.length === 0) {
        // Clear display metadata for detainee
        const newDisplayMeta = { ...(data.documents?.display_meta || {}) };
        delete newDisplayMeta.detainee_id;
        updateData("documents", {
          detainee_document_id: null,
          display_meta: newDisplayMeta,
        });
      }
      return filtered;
    });
  };

  const removeClientIdFile = (fileId: string) => {
    setClientIdFiles((prev) => {
      const filtered = prev.filter((file) => file.id !== fileId);
      // Clear the client document ID if we're removing the last file
      if (filtered.length === 0) {
        // Clear display metadata for client
        const newDisplayMeta = { ...(data.documents?.display_meta || {}) };
        delete newDisplayMeta.client_id;
        updateData("documents", {
          client_document_id: null,
          display_meta: newDisplayMeta,
        });
      }
      return filtered;
    });
  };

  const removeAdditionalFile = (fileId: string) => {
    setAdditionalFiles((prev) => {
      const filtered = prev.filter((file) => file.id !== fileId);
      // Update additional document IDs to remove the deleted file
      const remainingIds = getUploadedIds(filtered);
      // Update display metadata for additional files
      const newDisplayMeta = { ...(data.documents?.display_meta || {}) };
      newDisplayMeta.additional = filtered
        .filter((f) => f.status === "uploaded")
        .map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          status: f.status || "uploaded",
        }));
      updateData("documents", {
        additional_document_ids: remainingIds,
        display_meta: newDisplayMeta,
      });
      return filtered;
    });
  };

  // File size formatting handled in Uploader

  const validateForm = () => {
    // Require at least one uploaded (status==='uploaded') file for client ID only
    // Detainee ID is now optional
    const clientUploadedIds = getUploadedIds(clientIdFiles);
    const hasClientId = clientUploadedIds.length > 0;

    return hasClientId;
  };

  const handleNext = () => {
    const isValid = validateForm();

    if (isValid) {
      // Convert files to URLs or upload them to server
      const documents = {
        detaineeIdFiles: detaineeIdFiles.map((f) => ({
          name: f.name,
          size: f.size,
          url: f.url,
        })),
        clientIdFiles: clientIdFiles.map((f) => ({
          name: f.name,
          size: f.size,
          url: f.url,
        })),
        additionalFiles: additionalFiles.map((f) => ({
          name: f.name,
          size: f.size,
          url: f.url,
        })),
      };

      updateData("documents", documents);

      onComplete(currentStep);
      onNext();
    }
  };

  // Dropzones moved inside Uploader

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">
          {t("newCase.step5.stepNumber")}
        </span>
        <h2 className="steps__title">{t("newCase.step5.title")}</h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Client ID Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.step5.clientIdTitle")}{" "}
            <span className="steps__required">*</span>
          </h3>

          <Uploader
            documentTypeId={clientIdType}
            multiple={false}
            files={clientIdFiles as any}
            setFiles={setClientIdFiles}
            onRemove={removeClientIdFile}
            dropzoneText={t("newCase.step5.dropzone.text")}
            dropzoneHint={t("newCase.step5.dropzone.hint")}
            instanceId="client-id"
          />
        </section>

        {/* Detainee ID Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.step5.detaineeIdTitle")}
          </h3>

          <Uploader
            documentTypeId={detaineeIdType}
            multiple={false}
            files={detaineeIdFiles as any}
            setFiles={setDetaineeIdFiles}
            onRemove={removeDetaineeIdFile}
            dropzoneText={t("newCase.step5.dropzone.text")}
            dropzoneHint={t("newCase.step5.dropzone.hint")}
            instanceId="detainee-id"
          />
        </section>

        {/* Additional Documents Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.step5.additionalDocsTitle")}
          </h3>

          <Uploader
            documentTypeId={additionalType}
            multiple={true}
            files={additionalFiles as any}
            setFiles={setAdditionalFiles}
            onRemove={removeAdditionalFile}
            dropzoneText={t("newCase.step5.dropzone.text")}
            dropzoneHint={t("newCase.step5.dropzone.hint")}
            instanceId="additional-docs"
          />
        </section>

        {/* Navigation */}
        <div className="steps__navigation">
          <button
            type="button"
            className="steps__button steps__button--previous"
            onClick={onPrevious}
          >
            <span>{t("newCase.common.prev")}</span>
          </button>
          <button
            type="button"
            className="steps__button steps__button--next"
            onClick={handleNext}
            disabled={!validateForm()}
          >
            <span>{t("newCase.common.next")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
