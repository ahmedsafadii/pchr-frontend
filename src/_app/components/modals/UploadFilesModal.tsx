"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import { IconX, IconUpload, IconFile } from "@tabler/icons-react";
import { uploadLawyerCaseDocument } from "../../services/api";
import { LawyerAuth } from "../../utils/auth";

interface UploadFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onUploadSuccess?: () => void;
}

export default function UploadFilesModal({ 
  isOpen, 
  onClose, 
  caseId,
  onUploadSuccess 
}: UploadFilesModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState("");

  // Document type options
  const documentTypeOptions = [
    { value: "evidence", label: t("lawyer.files.documentTypes.evidence") },
    { value: "legal_document", label: t("lawyer.files.documentTypes.legalDocument") },
    { value: "correspondence", label: t("lawyer.files.documentTypes.correspondence") },
    { value: "other", label: t("lawyer.files.documentTypes.other") },
  ];

  // Access level options
  const accessLevelOptions = [
    { value: "private", label: t("lawyer.files.accessLevels.private") },
    { value: "case_only", label: t("lawyer.files.accessLevels.caseOnly") },
    { value: "lawyer_only", label: t("lawyer.files.accessLevels.lawyerOnly") },
    { value: "public", label: t("lawyer.files.accessLevels.public") },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setFileName("");
      setDocumentType("");
      setDescription("");
      setAccessLevel("");
      setError(null);
    }
  }, [isOpen]);

  const clearErrors = () => {
    setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill file name if not already set
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill file name if not already set
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Validation
    if (!fileName.trim()) {
      setError(t("lawyer.files.uploadModal.errors.fileNameRequired"));
      return;
    }

    if (!documentType) {
      setError(t("lawyer.files.uploadModal.errors.documentTypeRequired"));
      return;
    }

    if (!description.trim()) {
      setError(t("lawyer.files.uploadModal.errors.descriptionRequired"));
      return;
    }

    if (!accessLevel) {
      setError(t("lawyer.files.uploadModal.errors.accessLevelRequired"));
      return;
    }

    if (!selectedFile) {
      setError(t("lawyer.files.uploadModal.errors.fileRequired"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("document_type", documentType);
      formData.append("description", description);
      formData.append("access_level", accessLevel);

      const response = await uploadLawyerCaseDocument(token, caseId, formData, locale);
      
      if (response.status === "success") {
        onUploadSuccess?.();
        onClose();
      } else {
        setError(response.message || t("lawyer.files.uploadModal.errors.uploadFailed"));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || t("lawyer.files.uploadModal.errors.general"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{t("lawyer.files.uploadModal.title")}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          {error && (
            <div className="modal__error">
              {error}
            </div>
          )}

          <div className="modal__field">
            <label className="modal__label">
              {t("lawyer.files.uploadModal.fileName")} *
            </label>
            <input
              type="text"
              className="modal__input"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={t("lawyer.files.uploadModal.fileNamePlaceholder")}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="modal__field">
            <label className="modal__label">
              {t("lawyer.files.uploadModal.documentType")} *
            </label>
            <select
              className="modal__select"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="">{t("lawyer.files.uploadModal.documentTypePlaceholder")}</option>
              {documentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label">
              {t("lawyer.files.uploadModal.description")} *
            </label>
            <input
              type="text"
              className="modal__input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("lawyer.files.uploadModal.descriptionPlaceholder")}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="modal__field">
            <label className="modal__label">
              {t("lawyer.files.uploadModal.accessLevel")} *
            </label>
            <select
              className="modal__select"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="">{t("lawyer.files.uploadModal.accessLevelPlaceholder")}</option>
              {accessLevelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label">
              {t("lawyer.files.uploadModal.uploadFile")} *
            </label>
            <div
              className="modal__dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="modal__file-input"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                disabled={isSubmitting}
                required
              />
              <label htmlFor="file-upload" className="modal__dropzone-label">
                <IconFile size={24} />
                <span>{t("lawyer.files.uploadModal.dragDropText")}</span>
                <small>{t("lawyer.files.uploadModal.dragDropHint")}</small>
              </label>
            </div>
            {selectedFile && (
              <div className="modal__selected-file">
                <IconFile size={16} />
                <span>{selectedFile.name}</span>
                <small>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</small>
              </div>
            )}
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="modal__btn modal__btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--primary"
              disabled={isSubmitting || !selectedFile || !fileName.trim() || !documentType || !description.trim() || !accessLevel}
            >
              {isSubmitting ? (
                <>
                  <IconUpload size={16} />
                  {t("lawyer.files.uploadModal.uploading")}
                </>
              ) : (
                <>
                  <IconUpload size={16} />
                  {t("lawyer.files.uploadModal.send")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
