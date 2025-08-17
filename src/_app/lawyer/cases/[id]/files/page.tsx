"use client";

import { useTranslations } from "next-globe-gen";

// Mock files data - replace with real API calls
const mockFilesData = {
  caseFiles: [
    { id: 1, name: "ID.PDF", icon: "📄" }
  ],
  uploadedFiles: [
    { id: 2, name: "ID.PDF", icon: "📄" },
    { id: 3, name: "Proposal.PDF", icon: "📄" }
  ]
};

export default function LawyerCaseFilesPage() {
  const t = useTranslations();

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log("Upload files");
  };

  const handleFileDownload = (fileName: string) => {
    // TODO: Implement file download functionality
    console.log("Download file:", fileName);
  };

  const handleFileDelete = (fileId: number) => {
    // TODO: Implement file delete functionality
    console.log("Delete file:", fileId);
  };

  const renderFileItem = (file: any, showActions = true) => (
    <div key={file.id} className="lawyer__file-item">
      <div className="lawyer__file-icon">
        {file.icon}
      </div>
      <div className="lawyer__file-info">
        <h3 className="lawyer__file-name">{file.name}</h3>
      </div>
      {showActions && (
        <div className="lawyer__file-actions">
          <button 
            className="lawyer__file-action"
            onClick={() => handleFileDownload(file.name)}
            title="Download"
          >
            ⬇
          </button>
          <button 
            className="lawyer__file-action"
            onClick={() => handleFileDelete(file.id)}
            title="Delete"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );

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
          {mockFilesData.caseFiles.map(file => renderFileItem(file, false))}
        </div>
      </section>

      {/* Uploaded Files Section */}
      <section className="lawyer__files-section">
        <h2 className="lawyer__files-section-title">{t("lawyer.files.uploadedFiles")}</h2>
        <div className="lawyer__files-list">
          {mockFilesData.uploadedFiles.map(file => renderFileItem(file, true))}
        </div>
      </section>
    </>
  );
}
