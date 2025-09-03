"use client";

import { useTranslations, useLocale } from "next-globe-gen";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  IconTag,
  IconFileText,
  IconDownload,
  IconPaperclip,
  IconBell,
  IconSettings,
  IconInfoCircle,
  IconUser,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { formatDateWithLocale } from "../../../utils/dateUtils";
import { CaseDetailsData, CaseDocumentsData, CaseMessageData } from "../page";
import {
  getCaseMessages,
  uploadDocument,
  sendMessage,
} from "@/_app/services/api";

interface OverviewProps {
  caseData: CaseDetailsData | null;
  documentsData?: CaseDocumentsData | null; // Optional for now
  caseTrackingToken: string;
}

export default function Overview({
  caseData,
  documentsData,
  caseTrackingToken,
}: OverviewProps) {
  const t = useTranslations();
  const tt = t as any;
  const locale = useLocale();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<CaseMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; fileName: string; fileSize: number }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingRef = useRef(false);
  const PAGE_SIZE = 5; // Changed from 20 to 5

  console.log("Overview - documentsData:", documentsData);

  const loadMessages = useCallback(
    async (page: number = 1) => {
      if (loadingRef.current) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getCaseMessages(
          caseData?.id || "",
          caseTrackingToken,
          page,
          PAGE_SIZE
        );
        const newMessages = response.results.messages;

        if (page === 1) {
          setMessages(newMessages);
        } else {
          setMessages((prev) => [...newMessages, ...prev]);
        }

        setHasMore(!!response.next);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setError(tt("messages.errors.failedToLoadMessages"));
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [caseData?.id, caseTrackingToken, tt]
  );

  // Load messages on component mount
  useEffect(() => {
    if (
      (caseData?.id || "e627cf96-390a-4fe8-b152-8e86975bd096") &&
      caseTrackingToken
    ) {
      loadMessages();
    }
  }, [caseData?.id, caseTrackingToken, loadMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    // Alternative method if scrollIntoView doesn't work
    const messagesContainer = document.querySelector(".chat__messages");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Add a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await uploadDocument(file);
      if (response.status === "success") {
        const newFile = {
          id: response.data.document_id,
          fileName: response.data.file_name,
          fileSize: response.data.file_size_mb,
        };
        setUploadedFiles((prev) => [...prev, newFile]);
        toast.success(tt("messages.success.fileUploaded"));
      } else {
        // Handle API error response
        const errorMessage =
          response.error?.message ||
          response.message ||
          tt("messages.errors.failedToUploadFile");
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Failed to upload file:", error);
      // Extract error message from API response if available
      const errorMessage =
        error.payload?.error?.message ||
        error.payload?.message ||
        error.message ||
        tt("messages.errors.failedToUploadFile");
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && uploadedFiles.length === 0) return;

    setSending(true);
    try {
      const attachmentIds = uploadedFiles.map((file) => file.id);
      await sendMessage(
        caseData?.id || "e627cf96-390a-4fe8-b152-8e86975bd096",
        message.trim(),
        attachmentIds,
        caseTrackingToken
      );

      // Clear form and refresh messages
      setMessage("");
      setUploadedFiles([]);
      await loadMessages(); // Refresh messages
      toast.success(tt("messages.success.messageSent"));
    } catch (error: any) {
      console.error("Failed to send message:", error);
      // Extract error message from API response if available
      const errorMessage =
        error.payload?.error?.message ||
        error.payload?.message ||
        error.message ||
        tt("messages.errors.failedToSendMessage");
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      loadMessages(currentPage + 1);
    }
  };

  const getMessageTypeLabel = (messageType: string) => {
    switch (messageType) {
      case "system":
        return tt("trackCase.chat.systemMessage");
      case "notification":
        return tt("trackCase.chat.notification");
      case "lawyer":
        return tt("trackCase.chat.lawyer");
      case "client":
        return tt("trackCase.chat.client");
      default:
        return messageType;
    }
  };

  const getMessageTypeIcon = (messageType: string) => {
    switch (messageType) {
      case "system":
        return <IconSettings size={16} />;
      case "notification":
        return <IconBell size={16} />;
      case "lawyer":
        return <IconUser size={16} />;
      case "client":
        return <IconUser size={16} />;
      default:
        return <IconInfoCircle size={16} />;
    }
  };

  return (
    <div className="case-overview">
      <div className="case-overview__layout">
        {/* Left column: overview details */}
        <section className="case-overview__left">
          <div className="case-overview__card">
            <div className="case-overview__date">
              {caseData?.created
                ? formatDateWithLocale(caseData.created, locale).toUpperCase()
                : tt("common.loading")}
            </div>
            <h1 className="case-overview__main-title">
              {tt("trackCase.overview.detainee")}:{" "}
              {caseData?.detainee_name || tt("common.loading")}
            </h1>
            <span
              className={`case-overview__badge ${
                caseData?.status_display
                  ? `case__status--${caseData.status_display
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  : ""
              }`}
            >
              <IconTag size={18} />{" "}
              {caseData?.status_display || tt("common.loading")}
            </span>
            <hr className="case-overview__divider" />

            <div className="case-overview__grid">
              <div className="case-overview__section">
                <h3 className="case-overview__section-title">
                  {tt("trackCase.overview.basicInfo")}
                </h3>
                <dl className="case-overview__dl">
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">
                      {tt("trackCase.overview.dateOfDisappearance")}
                    </dt>
                    <dd className="case-overview__dd">
                      {caseData?.detention_date
                        ? formatDateWithLocale(caseData.detention_date, locale)
                        : tt("common.notAvailable")}
                    </dd>
                  </div>
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">
                      {tt("trackCase.overview.details")}
                    </dt>
                    <dd className="case-overview__dd">
                      {caseData?.detention_circumstances ||
                        tt("common.noDetailsAvailable")}
                    </dd>
                  </div>
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">
                      {tt("trackCase.overview.files")}
                    </dt>
                    <dd className="case-overview__dd">
                      <ul className="case-overview__files">
                        {documentsData?.data &&
                        documentsData.data.length > 0 ? (
                          documentsData.data.map((document) => (
                            <li
                              key={document.id}
                              className="case-overview__file"
                            >
                              <span className="case-overview__file-left">
                                <IconFileText size={18} />{" "}
                                {document.document_type_display.toLowerCase() ===
                                "other"
                                  ? document.file_name
                                  : `${document.document_type_display}${document.file_extension}`}{" "}
                                ({document.file_size_mb}MB)
                              </span>
                              <button
                                className="case-overview__file-download"
                                aria-label="download"
                                onClick={() => {
                                  if (document.download_url) {
                                    window.open(
                                      document.download_url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }
                                }}
                              >
                                <IconDownload size={18} />
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="case-overview__file">
                            <span className="case-overview__file-left">
                              <IconFileText size={18} />{" "}
                              {tt("trackCase.info.noDocuments")}
                            </span>
                          </li>
                        )}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: chat/messages */}
        <aside className="case-overview__right">
          <div className="chat">
            <div className="chat__header">
              <div className="chat__avatar">
                <img src="/img/pchr-white.svg" alt="PCHR" />
              </div>
              <div className="chat__meta">
                <span className="chat__name">
                  {tt("common.organizationFullName")}
                </span>
              </div>
            </div>

            <div className="chat__messages" ref={messagesEndRef}>
              {/* Load more button */}
              {hasMore && (
                <div className="chat__load-more">
                  <button
                    className="chat__load-more-btn"
                    onClick={loadMoreMessages}
                    disabled={loading}
                  >
                    {loading
                      ? tt("common.loading")
                      : tt("trackCase.chat.loadMore")}
                  </button>
                </div>
              )}

              {/* Messages list */}
              {(() => {
                const filteredMessages = messages.filter(
                  (msg) =>
                    msg.message_type === "client" ||
                    msg.message_type === "lawyer"
                );

                if (filteredMessages.length === 0 && !loading) {
                  return (
                    <div className="chat__no-messages">
                      {tt("trackCase.chat.noMessages")}
                    </div>
                  );
                }

                return [...filteredMessages].reverse().map((msg) => (
                  <article key={msg.id} className="chat__message">
                    <div className="chat__message-header">
                      {msg.message_type === "lawyer" ? (
                        <div className="chat__message-lawyer">
                          <div className="chat__message-lawyer-avatar chat__message-lawyer-avatar--pchr">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/img/pchr-white.svg" alt="PCHR" />
                          </div>
                          <span className="chat__message-lawyer-name">
                            {tt("common.organizationFullName")}
                          </span>
                        </div>
                      ) : msg.message_type === "client" ? (
                        <div className="chat__message-lawyer">
                          <div className="chat__message-lawyer-avatar">
                            {msg.case_info.client_name
                              ? msg.case_info.client_name
                                  .substring(0, 2)
                                  .toUpperCase()
                              : "CL"}
                          </div>
                          <span className="chat__message-lawyer-name">
                            {msg.case_info.client_name || "Client"}
                          </span>
                        </div>
                      ) : (
                        <span className="chat__message-type">
                          {getMessageTypeIcon(msg.message_type)}
                          {getMessageTypeLabel(msg.message_type)}
                        </span>
                      )}
                      <span className="chat__message-date">
                        {formatDateWithLocale(msg.created, locale)}
                      </span>
                    </div>

                    <div className="chat__message-content">
                      <p className="chat__text">{msg.content}</p>

                      {/* Attachments */}
                      {msg.has_attachments &&
                        msg.attachments &&
                        msg.attachments.length > 0 && (
                          <div className="chat__attachments">
                            {msg.attachments.map((attachment, index) => {
                              // Check for various possible download URL fields
                              const downloadUrl =
                                attachment.download_url ||
                                attachment.file_url ||
                                attachment.url ||
                                attachment.upload_path;
                              const fileName =
                                attachment.file_name ||
                                attachment.name ||
                                `Attachment ${index + 1}`;

                              // Handle file size - prefer file_size_mb, fallback to converting bytes
                              let fileSizeDisplay = "";
                              if (attachment.file_size_mb !== undefined) {
                                fileSizeDisplay = `${attachment.file_size_mb}MB`;
                              } else if (attachment.file_size) {
                                // Convert bytes to MB with 2 decimal places
                                const sizeInMB = (
                                  attachment.file_size /
                                  (1024 * 1024)
                                ).toFixed(2);
                                fileSizeDisplay = `${sizeInMB}MB`;
                              }

                              return (
                                <div
                                  key={index}
                                  className="chat__attachments__file"
                                >
                                  <IconFileText size={18} />
                                  <span className="chat__attachments__file-name">
                                    {fileName}
                                  </span>
                                  {fileSizeDisplay && (
                                    <span className="chat__attachments__file-size">
                                      ({fileSizeDisplay})
                                    </span>
                                  )}
                                  {downloadUrl && (
                                    <button
                                      className="chat__attachments__file-download"
                                      aria-label="download"
                                      onClick={() => {
                                        // Try to open in new tab, fallback to direct download
                                        try {
                                          window.open(
                                            downloadUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                          );
                                        } catch {
                                          // Fallback: create a temporary link and trigger download
                                          const link =
                                            document.createElement("a");
                                          link.href = downloadUrl;
                                          link.download = fileName;
                                          link.target = "_blank";
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        }
                                      }}
                                    >
                                      <IconDownload size={18} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  </article>
                ));
              })()}

              {/* Error display */}
              {error && (
                <div className="chat__error">
                  <p>{error}</p>
                  <button
                    onClick={() => loadMessages()}
                    className="chat__retry-btn"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="chat__loading">Loading messages...</div>
              )}

              {/* Scroll to bottom reference */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message form */}
            <form className="chat__form" onSubmit={handleSubmit}>
              <label className="chat__label" htmlFor="message">
                {tt("trackCase.overview.message")}
              </label>
              <textarea
                id="message"
                className="chat__textarea"
                placeholder={tt(
                  "trackCase.overview.messagePlaceholder"
                )?.toString()}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {/* Uploaded files display */}
              {uploadedFiles.length > 0 && (
                <div className="chat__uploaded-files">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="chat__uploaded-file">
                      <IconFileText size={16} />
                      <span className="chat__uploaded-file-name">
                        {file.fileName}
                      </span>
                      <span className="chat__uploaded-file-size">
                        ({file.fileSize}MB)
                      </span>
                      <button
                        type="button"
                        className="chat__uploaded-file-remove"
                        onClick={() => removeFile(file.id)}
                        aria-label="remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="chat__toolbar">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(handleFileUpload);
                    e.target.value = ""; // Reset input
                  }}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="chat__attach"
                  aria-label="attach"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "..." : <IconPaperclip size={18} />}
                </button>
                <span className="chat__counter">{`${message.length}/500`}</span>
              </div>
              <div className="chat__actions">
                <button
                  className="chat__btn"
                  type="submit"
                  disabled={
                    sending ||
                    (message.trim() === "" && uploadedFiles.length === 0)
                  }
                >
                  {sending ? "Sending..." : tt("trackCase.overview.next")}
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
