"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-globe-gen";
import { uploadDocumentFile } from "../services/api";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file: File;
  status?: "uploading" | "uploaded" | "error";
};

interface UploaderProps {
  documentTypeId: string | null;
  multiple?: boolean;
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  onRemove: (fileId: string) => void;
  dropzoneText: string;
  dropzoneHint: string;
  instanceId: string;
}

export default function Uploader({
  documentTypeId,
  multiple = false,
  files,
  setFiles,
  onRemove,
  dropzoneText,
  dropzoneHint,
  instanceId,
}: UploaderProps) {
  const locale = useLocale();
  const t = useTranslations();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("Uploader:onDrop", {
        instanceId,
        documentTypeId,
        locale,
        acceptedCount: acceptedFiles.length,
        acceptedPreview: acceptedFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      });
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).slice(2),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        url: URL.createObjectURL(file),
        status: "uploading",
      }));
      setFiles(multiple ? [...files, ...newFiles] : newFiles);

      // Fire-and-forget upload to get server file id(s)
      if (documentTypeId) {
        newFiles.forEach(async (f) => {
          try {
            console.log("Uploader:upload:start", {
              instanceId,
              documentTypeId,
              file: { name: f.name, size: f.size, type: f.type },
            });
            const res = await uploadDocumentFile(
              documentTypeId,
              f.file,
              locale
            );
            const serverId = (res?.data?.document_id ?? null) as string | null;
            console.log("Uploader:upload:success", {
              instanceId,
              tempId: f.id,
              serverId,
              apiResponse: res,
            });
            setFiles((prev) =>
              prev.map((pf) =>
                pf.id === f.id
                  ? ({
                      ...pf,
                      id: serverId ?? pf.id,
                      status: serverId ? "uploaded" : "error",
                    } as UploadedFile)
                  : pf
              )
            );
          } catch (error) {
            console.error("Uploader:upload:error", {
              instanceId,
              documentTypeId,
              file: { name: f.name, size: f.size, type: f.type },
              error,
            });
            setFiles((prev) =>
              prev.map((pf) => (pf.id === f.id ? { ...pf, status: "error" } : pf))
            );
          }
        });
      } else {
        console.warn("Uploader:no-documentTypeId", { instanceId });
      }
    },
    [files, multiple, setFiles, documentTypeId, locale]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Accept common document types
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxSize: 1.5 * 1024 * 1024,
    multiple,
  });

  return (
    <div className="uploader" data-doc-type={documentTypeId ?? undefined}>
      {files.length > 0 && (
        <div className="steps__uploaded-files">
          {files.map((file) => (
            <div key={file.id} className="steps__uploaded-file">
              <span className="steps__file-name">{file.name}</span>
              <span className="steps__file-size">
                {Math.round(file.size / 102.4) / 10} KB
              </span>
              <span className="steps__file-status" style={{ color: file.status === "error" ? "#dc3545" : undefined }}>
                {file.status === "uploading" && t("newCase.step5.uploadStatus.uploading")}
                {file.status === "uploaded" && t("newCase.step5.uploadStatus.uploaded")}
                {file.status === "error" && t("newCase.step5.uploadStatus.failed")}
              </span>
              <button
                type="button"
                className="steps__file-remove"
                onClick={() => onRemove(file.id)}
                disabled={file.status === "uploading"}
                aria-label={`${instanceId}-remove`}
              >
                <IconTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`steps__dropzone ${
          isDragActive ? "steps__dropzone--active" : ""
        }`}
      >
        <input {...getInputProps()} data-testid={`${instanceId}-input`} />
        <IconPlus size={24} className="steps__dropzone-icon" />
        <p className="steps__dropzone-text">{dropzoneText}</p>
        <p className="steps__dropzone-hint">{dropzoneHint}</p>
      </div>
    </div>
  );
}
