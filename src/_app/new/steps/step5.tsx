"use client";

import { useState, useEffect } from "react";
// Dropzone is handled inside Uploader component
import { CaseData } from "../page";
import { useTranslations } from "next-globe-gen";
import Uploader from "../../components/Uploader";
import { useDocumentTypeId } from "../../utils/constants-helpers";

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
  externalErrors?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file: File;
}

export default function Step5({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  externalErrors = [],
}: Step5Props) {
  const t = useTranslations();
  const [detaineeIdFiles, setDetaineeIdFiles] = useState<UploadedFile[]>([]);
  const [clientIdFiles, setClientIdFiles] = useState<UploadedFile[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFile[]>([]);
  const idCardTypeId = useDocumentTypeId('id_card');
  const otherTypeId = useDocumentTypeId('other');

  // Helper to extract uploaded server ids
  const getUploadedIds = (files: any[]) =>
    files.filter((f) => f?.status === 'uploaded' && typeof f?.id === 'string').map((f) => f.id as string);

  const updateDocuments = (
    nextDetainee: UploadedFile[] = detaineeIdFiles,
    nextClient: UploadedFile[] = clientIdFiles,
    nextAdditional: UploadedFile[] = additionalFiles
  ) => {
    const detaineeId = getUploadedIds(nextDetainee)[0] ?? null;
    const clientId = getUploadedIds(nextClient)[0] ?? null;
    const additionalIds = getUploadedIds(nextAdditional);
    updateData('documents', {
      detainee_document_id: detaineeId,
      client_document_id: clientId,
      additional_document_ids: additionalIds,
    });
  };

  useEffect(() => {
    // Hydrate from existing documents data on mount/prop change
    const docs = data.documents;
    if (!docs) return;

    // If there is a known uploaded detainee_document_id but local list is empty, show a placeholder entry
    if (docs.detainee_document_id && detaineeIdFiles.length === 0) {
      const meta = docs.display_meta?.detainee;
      setDetaineeIdFiles([
        {
          id: docs.detainee_document_id,
          name: meta?.name ?? "document.pdf",
          size: meta?.size ?? 0,
          type: "application/pdf",
          file: new File([new Blob()], meta?.name ?? "document.pdf", { type: "application/pdf" }),
          url: undefined,
          status: "uploaded",
        } as any,
      ]);
    }

    if (docs.client_document_id && clientIdFiles.length === 0) {
      const meta = docs.display_meta?.client;
      setClientIdFiles([
        {
          id: docs.client_document_id,
          name: meta?.name ?? "document.pdf",
          size: meta?.size ?? 0,
          type: "application/pdf",
          file: new File([new Blob()], meta?.name ?? "document.pdf", { type: "application/pdf" }),
          url: undefined,
          status: "uploaded",
        } as any,
      ]);
    }

    if (Array.isArray(docs.additional_document_ids) && additionalFiles.length === 0) {
      const metas = docs.display_meta?.additional ?? [];
      setAdditionalFiles(
        docs.additional_document_ids.map((id) => {
          const meta = metas.find((m) => m.id === id);
          return {
            id,
            name: meta?.name ?? "document.pdf",
            size: meta?.size ?? 0,
            type: "application/pdf",
            file: new File([new Blob()], meta?.name ?? "document.pdf", { type: "application/pdf" }),
            url: undefined,
            status: "uploaded",
          } as any;
        })
      );
    }
  }, [data.documents, detaineeIdFiles.length, clientIdFiles.length, additionalFiles.length]);

  // Drop handlers moved into Uploader

  const removeDetaineeIdFile = (fileId: string) => {
    setDetaineeIdFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const removeClientIdFile = (fileId: string) => {
    setClientIdFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const removeAdditionalFile = (fileId: string) => {
    setAdditionalFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // File size formatting handled in Uploader

  const validateForm = () => {
    // Require at least one uploaded (status==='uploaded') file for detainee and client IDs
    const hasDetaineeId = getUploadedIds(detaineeIdFiles).length > 0;
    const hasClientId = getUploadedIds(clientIdFiles).length > 0;
    return hasDetaineeId && hasClientId;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Convert files to URLs or upload them to server
      const documents = {
        detaineeIdFiles: detaineeIdFiles.map(f => ({ name: f.name, size: f.size, url: f.url })),
        clientIdFiles: clientIdFiles.map(f => ({ name: f.name, size: f.size, url: f.url })),
        additionalFiles: additionalFiles.map(f => ({ name: f.name, size: f.size, url: f.url }))
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
        <span className="steps__step-number">{t("newCase.step5.stepNumber")}</span>
        <h2 className="steps__title">
          {t("newCase.step5.title")}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {externalErrors.length > 0 && (
          <div className="steps__error-summary">
            <ul>
              {externalErrors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Detainee ID Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">{t("newCase.step5.detaineeIdTitle")} <span className="steps__required">*</span></h3>
          <Uploader
            documentTypeId={idCardTypeId}
            multiple={false}
            files={detaineeIdFiles as any}
            setFiles={(files) => {
              setDetaineeIdFiles(files as any);
              updateDocuments(files as any, clientIdFiles as any, additionalFiles as any);
              // Persist minimal display meta
              const first = (files as any[])[0];
              if (first && first.status === 'uploaded') {
                updateData('documents', {
                  ...data.documents,
                  display_meta: {
                    ...(data.documents?.display_meta || {}),
                    detainee: { name: first.name, size: first.size },
                  },
                });
              }
            }}
            onRemove={removeDetaineeIdFile}
            dropzoneText={t("newCase.step5.dropzone.text")}
            dropzoneHint={t("newCase.step5.dropzone.hint")}
            instanceId="detainee-id"
          />
        </section>

        {/* Client ID Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">{t("newCase.step5.clientIdTitle")} <span className="steps__required">*</span></h3>
          
          <Uploader
            documentTypeId={idCardTypeId}
            multiple={true}
            files={clientIdFiles as any}
            setFiles={(files) => {
              setClientIdFiles(files as any);
              updateDocuments(detaineeIdFiles as any, files as any, additionalFiles as any);
              const first = (files as any[])[0];
              if (first && first.status === 'uploaded') {
                updateData('documents', {
                  ...data.documents,
                  display_meta: {
                    ...(data.documents?.display_meta || {}),
                    client: { name: first.name, size: first.size },
                  },
                });
              }
            }}
            onRemove={removeClientIdFile}
            dropzoneText={t("newCase.step5.dropzone.text")}
            dropzoneHint={t("newCase.step5.dropzone.hint")}
            instanceId="client-id"
          />
        </section>

        {/* Additional Documents Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">{t("newCase.step5.additionalDocsTitle")}</h3>
          
          <Uploader
            documentTypeId={otherTypeId}
            multiple={true}
            files={additionalFiles as any}
            setFiles={(files) => {
              setAdditionalFiles(files as any);
              updateDocuments(detaineeIdFiles as any, clientIdFiles as any, files as any);
              const metas = (files as any[]).filter((f) => f.status === 'uploaded').map((f) => ({ id: f.id, name: f.name, size: f.size }));
              updateData('documents', {
                ...data.documents,
                display_meta: {
                  ...(data.documents?.display_meta || {}),
                  additional: metas,
                },
              });
            }}
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