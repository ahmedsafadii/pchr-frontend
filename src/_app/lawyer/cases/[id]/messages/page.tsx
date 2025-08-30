"use client";

import { useTranslations, useLocale } from "next-globe-gen";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  IconFile,
  IconDownload,
  IconFileText,
  IconPaperclip,
  IconBell,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import {
  getLawyerConversation,
  sendLawyerMessage,
  uploadDocument,
} from "@/_app/services/api";
import { LawyerAuth } from "@/_app/utils/auth";
import { formatDateWithLocale } from "../../../../utils/dateUtils";

interface LawyerMessageData {
  id: string;
  case_info: {
    id: string;
    case_number: string;
    detainee_name: string;
    client_name: string;
    client_phone: string;
    status: string;
    status_display: string;
    assigned_lawyer_name: string;
    created: string;
  };
  sender: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
  recipient: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
  content: string;
  message_type: "notification" | "system" | "lawyer" | "client";
  message_type_display: string;
  is_read: boolean;
  is_archived: boolean;
  attachments: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    file_size_formatted: string;
    document_type: string;
    created: string;
  }>;
  has_attachments: boolean;
  created: string;
  updated: string;
  read_at: string | null;
  read_by: string | null;
  case_timeline: {
    case_number: string;
    detainee_name: string;
    client_name: string;
    status: string;
    assigned_lawyer: string;
    created_date: string;
    visits_count: number;
    documents_count: number;
    messages_count: number;
  };
}

export default function LawyerCaseMessagesPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = useLocale();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<LawyerMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; fileName: string; fileSize: number }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingRef = useRef(false);
  const PAGE_SIZE = 5;
  const maxLength = 500;

  // Get case ID from URL params
  const caseId = params?.id as string;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    const messagesContainer = document.querySelector(".lawyer__messages-list");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const loadMessages = useCallback(
    async (page: number = 1) => {
      if (loadingRef.current) return;

      const accessToken = LawyerAuth.getAccessToken();
      if (!accessToken) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      try {
        const response = await getLawyerConversation(
          caseId,
          page,
          PAGE_SIZE,
          accessToken
        );
        const newMessages = response.results.messages;

        if (page === 1) {
          setMessages(newMessages);
        } else {
          setMessages((prev) => [...newMessages, ...prev]);
        }

        setHasMore(!!response.next);
        setCurrentPage(page);
      } catch (error: any) {
        console.error("Failed to load messages:", error);
        const errorMessage =
          error.payload?.error?.message ||
          error.payload?.message ||
          error.message ||
          "Failed to load messages. Please try again.";
        toast.error(errorMessage);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [caseId]
  );

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      loadMessages(currentPage + 1);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    if (caseId) {
      loadMessages();
    }
  }, [caseId, loadMessages]);

  const getMessageTypeLabel = (messageType: string) => {
    switch (messageType) {
      case "system":
        return t("trackCase.chat.systemMessage");
      case "notification":
        return t("trackCase.chat.notification");
      case "lawyer":
        return t("trackCase.chat.lawyer");
      case "client":
        return t("trackCase.chat.client");
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
        return <IconFile size={16} />;
    }
  };

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
        toast.success(t("messages.success.fileUploaded"));
      } else {
        const errorMessage =
          response.error?.message ||
          response.message ||
          "Failed to upload file";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Failed to upload file:", error);
      const errorMessage =
        error.payload?.error?.message ||
        error.payload?.message ||
        error.message ||
        "Failed to upload file. Please try again.";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return;

    const accessToken = LawyerAuth.getAccessToken();
    if (!accessToken) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    setSending(true);
    try {
      const attachmentIds = uploadedFiles.map((file) => file.id);
      await sendLawyerMessage(
        caseId,
        message.trim(),
        "lawyer",
        attachmentIds,
        accessToken
      );

      // Clear form and refresh messages
      setMessage("");
      setUploadedFiles([]);
      await loadMessages(); // Refresh messages
      toast.success(t("messages.success.messageSent"));
    } catch (error: any) {
      console.error("Failed to send message:", error);
      const errorMessage =
        error.payload?.error?.message ||
        error.payload?.message ||
        error.message ||
        "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="lawyer__messages">
      {/* Header - Client Avatar */}
      <div className="lawyer__messages-header">
        <div className="lawyer__messages-avatar">
          {messages.length > 0 && messages[0].case_info.client_name
            ? messages[0].case_info.client_name.substring(0, 2).toUpperCase()
            : "CL"}
        </div>
        <div className="lawyer__messages-info">
          <div className="lawyer__messages-role">Client</div>
          <h1 className="lawyer__messages-name">
            {messages.length > 0 && messages[0].case_info.client_name
              ? messages[0].case_info.client_name
              : "Client"}
          </h1>
        </div>
      </div>

      {/* Messages List */}
      <div className="lawyer__messages-list">
        {/* Load more button */}
        {hasMore && (
          <div className="lawyer__messages-load-more">
            <button
              className="lawyer__messages-load-more-btn"
              onClick={loadMoreMessages}
              disabled={loading}
            >
              {loading ? t("common.loading") : t("common.loadMoreMessages")}
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 && !loading ? (
          <div className="lawyer__messages-no-messages">
            {t("trackCase.chat.noMessages")}
          </div>
        ) : (
          [...messages].reverse().map((msg) => (
            <div key={msg.id} className="lawyer__message">
              {/* Message Header */}
              <div className="lawyer__message-header">
                {msg.message_type === "lawyer" ? (
                  <div className="lawyer__message-lawyer">
                    <div className="lawyer__message-lawyer-avatar lawyer__message-lawyer-avatar--pchr">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/img/pchr-white.svg" alt="PCHR" />
                    </div>
                    <span className="lawyer__message-lawyer-name">
                      {t("common.organizationFullName")}
                    </span>
                  </div>
                ) : msg.message_type === "client" ? (
                  <div className="lawyer__message-lawyer">
                    <div className="lawyer__message-lawyer-avatar">
                      {msg.case_info.client_name
                        ? msg.case_info.client_name
                            .substring(0, 2)
                            .toUpperCase()
                        : "CL"}
                    </div>
                    <span className="lawyer__message-lawyer-name">
                      {msg.case_info.client_name || "Client"}
                    </span>
                  </div>
                ) : (
                  <span className="lawyer__message-type">
                    {getMessageTypeIcon(msg.message_type)}
                    {getMessageTypeLabel(msg.message_type)}
                  </span>
                )}

                {/* Message Date */}
                <div className="lawyer__message-date">
                  {formatDateWithLocale(msg.created, locale)}
                </div>
              </div>

              {/* Message Content */}
              <div className="lawyer__message-content">
                <p className="lawyer__message-text">{msg.content}</p>

                {/* Attachments */}
                {msg.has_attachments &&
                  msg.attachments &&
                  msg.attachments.length > 0 && (
                    <div className="lawyer__message-attachments">
                      {msg.attachments.map((attachment, index) => {
                        const downloadUrl = attachment.file_url;
                        const fileName =
                          attachment.file_name || `Attachment ${index + 1}`;
                        const fileSize = attachment.file_size_formatted || "";

                        return (
                          <div
                            key={index}
                            className="lawyer__message-attachment"
                          >
                            <IconFileText size={18} />
                            <span className="lawyer__message-attachment-name">
                              {fileName}
                            </span>
                            {fileSize && (
                              <span className="lawyer__message-attachment-size">
                                ({fileSize})
                              </span>
                            )}
                            {downloadUrl && (
                              <button
                                className="lawyer__message-attachment-download"
                                aria-label="download"
                                onClick={() => {
                                  try {
                                    window.open(
                                      downloadUrl,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  } catch {
                                    const link = document.createElement("a");
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
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="lawyer__messages-loading">Loading messages...</div>
        )}

        {/* Scroll to bottom reference */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Form */}
      <div className="lawyer__message-form">
        <textarea
          className="lawyer__message-input"
          placeholder={t("lawyer.messages.messagePlaceholder")?.toString()}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          maxLength={maxLength}
        />

        {/* Uploaded files display */}
        {uploadedFiles.length > 0 && (
          <div className="lawyer__uploaded-files">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="lawyer__uploaded-file">
                <IconFileText size={16} />
                <span className="lawyer__uploaded-file-name">
                  {file.fileName}
                </span>
                <span className="lawyer__uploaded-file-size">
                  ({file.fileSize}MB)
                </span>
                <button
                  type="button"
                  className="lawyer__uploaded-file-remove"
                  onClick={() => removeFile(file.id)}
                  aria-label="remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="lawyer__message-toolbar">
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
            className="lawyer__message-attach"
            aria-label="attach"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "..." : <IconPaperclip size={18} />}
          </button>
          <div className="lawyer__message-counter">
            {message.length}/{maxLength}
          </div>
          <button
            className="lawyer__message-send"
            onClick={handleSendMessage}
            disabled={
              sending || (message.trim() === "" && uploadedFiles.length === 0)
            }
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
