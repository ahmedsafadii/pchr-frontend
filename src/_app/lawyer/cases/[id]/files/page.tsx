"use client";

import { useTranslations } from "next-globe-gen";
import { IconFile, IconDownload, IconPdf, IconFileText } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLawyerCaseDocuments } from "../../../../services/api";
import { LawyerAuth } from "../../../../utils/auth";
import UploadFilesModal from "../../../../components/modals/UploadFilesModal";

export default function LawyerCaseFilesPage() {
  const t = useTranslations();
  const params = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchCaseDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = LawyerAuth.getAccessToken();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const caseId = params.id as string;
        const response = await getLawyerCaseDocuments(token, caseId, "en");
        
        if (response.status === "success") {
          setCaseData(response.data);
        } else {
          setError(t("messages.errors.failedToFetchCaseDocuments"));
        }
      } catch (err: any) {
        console.error("Error fetching case documents:", err);
        setError(err.message || t("messages.errors.failedToFetchCaseDocuments"));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCaseDocuments();
    }
  }, [params.id, t]);

  const handleFileUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    // Refresh the case documents after successful upload
    if (params.id) {
      const fetchCaseDocuments = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const token = LawyerAuth.getAccessToken();
          if (!token) {
            setError("Authentication required");
            setLoading(false);
            return;
          }

          const caseId = params.id as string;
          const response = await getLawyerCaseDocuments(token, caseId, "en");
          
          if (response.status === "success") {
            setCaseData(response.data);
          } else {
            setError(t("messages.errors.failedToFetchCaseDocuments"));
          }
        } catch (err: any) {
          console.error("Error fetching case documents:", err);
          setError(err.message || t("messages.errors.failedToFetchCaseDocuments"));
        } finally {
          setLoading(false);
        }
      };
      
      fetchCaseDocuments();
    }
  };



  const renderFileItem = (file: {
    id: string;
    file_name: string;
    file_size: number;
    document_type_display: string;
    is_verified: boolean;
    description?: string;
    download_url?: string;
    is_pdf: boolean;
    is_word_document: boolean;
    is_image: boolean;
  }) => {
    const getFileIcon = () => {
      if (file.is_pdf) return <IconPdf size={20} />;
      if (file.is_word_document) return <IconFileText size={20} />;
      if (file.is_image) return <IconFile size={20} />;
      return <IconFile size={20} />;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleDownload = () => {
      if (file.download_url) {
        window.open(file.download_url, '_blank');
      }
    };

    return (
      <div key={file.id} className="lawyer__file-item">
        <div className="lawyer__file-icon">
          {getFileIcon()}
        </div>
        <div className="lawyer__file-info">
          <h3 className="lawyer__file-name">{file.file_name}</h3>
          <p className="lawyer__file-details">
            {file.document_type_display} • {formatFileSize(file.file_size)} • {file.is_verified ? "Verified" : "Not Verified"}
          </p>
          {file.description && (
            <p className="lawyer__file-description">{file.description}</p>
          )}
        </div>
        <div className="lawyer__file-actions">
          <button 
            className="lawyer__file-action"
            onClick={handleDownload}
            title="Download"
            disabled={!file.download_url}
          >
            <IconDownload size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="lawyer__files-loading">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lawyer__files-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="lawyer__retry-btn">
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="lawyer__files-error">
        <p>{t("common.caseNotFound")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="lawyer__files-header">
        <h1 className="lawyer__files-title">{t("lawyer.files.title")}</h1>
        <button className="lawyer__upload-btn" onClick={handleFileUpload}>
          {t("lawyer.files.uploadFiles")}
        </button>
      </div>



      {/* Case Files Section */}
      <section className="lawyer__files-section">
        <h2 className="lawyer__files-section-title">{t("lawyer.files.caseFiles")}</h2>
        <div className="lawyer__files-list">
          {caseData.case_files && caseData.case_files.length > 0 ? (
            caseData.case_files.map((file: any) => renderFileItem(file))
          ) : (
            <p className="lawyer__no-files">{t("common.noDocuments")}</p>
          )}
        </div>
      </section>

      {/* Uploaded Files Section */}
      <section className="lawyer__files-section">
        <h2 className="lawyer__files-section-title">{t("lawyer.files.uploadedFiles")}</h2>
        <div className="lawyer__files-list">
          {caseData.uploaded_files && caseData.uploaded_files.length > 0 ? (
            caseData.uploaded_files.map((file: any) => renderFileItem(file))
          ) : (
            <p className="lawyer__no-files">{t("common.noDocuments")}</p>
          )}
        </div>
      </section>

      {/* Upload Files Modal */}
      <UploadFilesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        caseId={params.id as string}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}
