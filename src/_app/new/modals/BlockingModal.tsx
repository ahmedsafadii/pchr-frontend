"use client";

import { ReactNode } from "react";

interface BlockingModalProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function BlockingModal({
  isOpen,
  children,
}: BlockingModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal modal--blocking" role="dialog" aria-modal="true">
      <div className="modal__backdrop" />
      <div className="modal__content modal__content--center">{children}</div>
      <style jsx>{`
        .modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
        }
        .modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
        }
        .modal__content {
          position: relative;
          margin: 0 auto;
          top: 45%;
          transform: translate(0, -50%);
          max-width: 480px;
          background: var(--color-surface, #fff);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          padding: 36px;
        }
        .modal__content--center {
          text-align: center;
        }
      `}</style>
    </div>
  );
}
