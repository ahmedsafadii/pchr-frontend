"use client";

import { useTranslations } from "next-globe-gen";
import { useState } from "react";

// Mock messages data - replace with real API calls
const mockMessages = [
  {
    id: 1,
    date: "23 Feb 2024",
    title: "Huge Update for the case",
    content: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into",
    attachments: [
      { name: "ID.PDF", icon: "📄" }
    ]
  },
  {
    id: 2,
    date: "23 Feb 2024",
    title: "",
    content: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s",
    attachments: []
  }
];

export default function LawyerCaseMessagesPage() {
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const maxLength = 500;

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message via API
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="lawyer__messages">
      {/* Header */}
      <div className="lawyer__messages-header">
        <div className="lawyer__messages-avatar">MM</div>
        <div className="lawyer__messages-info">
          <div className="lawyer__messages-role">{t("lawyer.messages.lawyer")}</div>
          <h1 className="lawyer__messages-name">Moahmoud Mansour</h1>
        </div>
      </div>

      {/* Messages List */}
      <div className="lawyer__messages-list">
        {mockMessages.map((msg) => (
          <div key={msg.id} className="lawyer__message">
            <div className="lawyer__message-date">{msg.date}</div>
            {msg.title && <h3 className="lawyer__message-title">{msg.title}</h3>}
            <p className="lawyer__message-text">{msg.content}</p>
            
            {msg.attachments.length > 0 && (
              <div className="lawyer__message-attachments">
                {msg.attachments.map((attachment, index) => (
                  <div key={index} className="lawyer__message-attachment">
                    <span>{attachment.icon}</span>
                    <span>{attachment.name}</span>
                    <button className="lawyer__message-attachment-download">
                      <span>⬇</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
        
        <div className="lawyer__message-toolbar">
          <div className="lawyer__message-counter">
            {message.length}/{maxLength}
          </div>
          <button 
            className="lawyer__message-send"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            {t("lawyer.messages.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
