"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { CaseData } from "../page";

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
  canGoNext,
  locale = "en",
}: Step5Props) {
  const [detaineeIdFiles, setDetaineeIdFiles] = useState<UploadedFile[]>([]);
  const [clientIdFiles, setClientIdFiles] = useState<UploadedFile[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    // Initialize with existing data if available
    if (data.documents) {
      // Convert existing data to UploadedFile format if needed
      // This would depend on how you want to handle existing data
    }
  }, [data.documents]);

  const onDetaineeIdDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file)
    }));
    setDetaineeIdFiles(prev => [...prev, ...newFiles]);
  }, []);

  const onClientIdDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file)
    }));
    setClientIdFiles(prev => [...prev, ...newFiles]);
  }, []);

  const onAdditionalDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file)
    }));
    setAdditionalFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeDetaineeIdFile = (fileId: string) => {
    setDetaineeIdFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const removeClientIdFile = (fileId: string) => {
    setClientIdFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const removeAdditionalFile = (fileId: string) => {
    setAdditionalFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    // For documents, we might want to require at least one file
    // or make it optional depending on requirements
    return true; // For now, documents are optional
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

  const { getRootProps: getDetaineeIdRootProps, getInputProps: getDetaineeIdInputProps, isDragActive: isDetaineeIdDragActive } = useDropzone({
    onDrop: onDetaineeIdDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 1.5 * 1024 * 1024, // 1.5 MB
    multiple: false
  });

  const { getRootProps: getClientIdRootProps, getInputProps: getClientIdInputProps, isDragActive: isClientIdDragActive } = useDropzone({
    onDrop: onClientIdDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 1.5 * 1024 * 1024, // 1.5 MB
    multiple: true
  });

  const { getRootProps: getAdditionalRootProps, getInputProps: getAdditionalInputProps, isDragActive: isAdditionalDragActive } = useDropzone({
    onDrop: onAdditionalDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 1.5 * 1024 * 1024, // 1.5 MB
    multiple: true
  });

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 5</span>
        <h2 className="steps__title">
          {locale === "ar" ? "رفع المستندات" : "Documents upload"}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Detainee ID Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {locale === "ar" ? "هوية المعتقل" : "Detainee ID"}
          </h3>
          
          {/* Show uploaded files */}
          {detaineeIdFiles.length > 0 && (
            <div className="steps__uploaded-files">
              {detaineeIdFiles.map((file) => (
                <div key={file.id} className="steps__uploaded-file">
                  <span className="steps__file-name">{file.name}</span>
                  <span className="steps__file-size">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    className="steps__file-remove"
                    onClick={() => removeDetaineeIdFile(file.id)}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            {...getDetaineeIdRootProps()}
            className={`steps__dropzone ${isDetaineeIdDragActive ? 'steps__dropzone--active' : ''}`}
          >
            <input {...getDetaineeIdInputProps()} />
            <IconPlus size={24} className="steps__dropzone-icon" />
            <p className="steps__dropzone-text">
              {locale === "ar" ? "اسحب وأفلت اختر من الملفات" : "Drag & Drop Choose from files"}
            </p>
            <p className="steps__dropzone-hint">
              {locale === "ar" ? "DOCS, PDF, EXL, حتى 1.5 ميجابايت" : "DOCS, PDF, EXL, Up To 1.5 MB"}
            </p>
          </div>
        </section>

        {/* Client ID Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {locale === "ar" ? "هوية العميل" : "Client ID"}
          </h3>
          
          {/* Show uploaded files */}
          {clientIdFiles.length > 0 && (
            <div className="steps__uploaded-files">
              {clientIdFiles.map((file) => (
                <div key={file.id} className="steps__uploaded-file">
                  <span className="steps__file-name">{file.name}</span>
                  <span className="steps__file-size">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    className="steps__file-remove"
                    onClick={() => removeClientIdFile(file.id)}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            {...getClientIdRootProps()}
            className={`steps__dropzone ${isClientIdDragActive ? 'steps__dropzone--active' : ''}`}
          >
            <input {...getClientIdInputProps()} />
            <IconPlus size={24} className="steps__dropzone-icon" />
            <p className="steps__dropzone-text">
              {locale === "ar" ? "اسحب وأفلت اختر من الملفات" : "Drag & Drop Choose from files"}
            </p>
            <p className="steps__dropzone-hint">
              {locale === "ar" ? "DOCS, PDF, EXL, حتى 1.5 ميجابايت" : "DOCS, PDF, EXL, Up To 1.5 MB"}
            </p>
          </div>
        </section>

        {/* Additional Documents Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {locale === "ar" ? "مستندات إضافية" : "Additional documentations"}
          </h3>
          
          {/* Show uploaded files */}
          {additionalFiles.length > 0 && (
            <div className="steps__uploaded-files">
              {additionalFiles.map((file) => (
                <div key={file.id} className="steps__uploaded-file">
                  <span className="steps__file-name">{file.name}</span>
                  <span className="steps__file-size">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    className="steps__file-remove"
                    onClick={() => removeAdditionalFile(file.id)}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            {...getAdditionalRootProps()}
            className={`steps__dropzone ${isAdditionalDragActive ? 'steps__dropzone--active' : ''}`}
          >
            <input {...getAdditionalInputProps()} />
            <IconPlus size={24} className="steps__dropzone-icon" />
            <p className="steps__dropzone-text">
              {locale === "ar" ? "اسحب وأفلت اختر من الملفات" : "Drag & Drop Choose from files"}
            </p>
            <p className="steps__dropzone-hint">
              {locale === "ar" ? "DOCS, PDF, EXL, حتى 1.5 ميجابايت" : "DOCS, PDF, EXL, Up To 1.5 MB"}
            </p>
          </div>
        </section>

        {/* Navigation */}
        <div className="steps__navigation">
          <button
            type="button"
            className="steps__button steps__button--previous"
            onClick={onPrevious}
          >
            <span>{locale === "ar" ? "السابق" : "Prev"}</span>
          </button>
          <button
            type="button"
            className="steps__button steps__button--next"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <span>{locale === "ar" ? "التالي" : "Next"}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 