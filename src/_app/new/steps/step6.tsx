"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import { submitCase, uploadDocumentFile } from "../../services/api";
import ConfirmSubmitModal from "../modals/ConfirmSubmitModal";
import LoadingModal from "../modals/LoadingModal";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";
import { IconDownload, IconFileText } from "@tabler/icons-react";
import { CaseData } from "../page";
import { useDocumentTypeId } from "../../utils/constants-helpers";

interface Step6Props {
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

export default function Step6({
  data,
  updateData,
  onComplete,
  onPrevious,
  currentStep,
}: Step6Props) {
  const [consentAccepted] = useState(true);
  const [, setSignature] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const t = useTranslations();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [caseRef, setCaseRef] = useState<string>("");
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const otherDocTypeId = useDocumentTypeId("other");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    contextRef.current?.closePath();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
    setHasDrawn(false);
    setSignatureError(null);
  };

  const uploadSignature = async () => {
    setSignatureError(null);
    // If already uploaded via file, skip
    if (data.consent.signature_document_id) return;
    if (!hasDrawn) {
      setSignatureError(t("newCase.step6.alerts.missingSignature"));
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      setIsUploadingSignature(true);
      // Convert canvas to blob then to File
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve as BlobCallback, "image/png")
      );
      if (!blob) throw new Error("Failed to get signature blob");
      const file = new File([blob], `signature-${Date.now()}.png`, {
        type: "image/png",
      });
      if (!otherDocTypeId) throw new Error("Missing document type id");
      const res = await uploadDocumentFile(otherDocTypeId, file, locale);
      const serverId = (res?.data?.document_id ?? null) as string | null;
      if (!serverId) throw new Error("Upload did not return document_id");
      // Save id in consent; this will satisfy step validation
      updateData("consent", {
        ...data.consent,
        signature_document_id: serverId,
      });
    } catch (e: any) {
      console.error("Step6:signatureUpload:error", e);
      setSignatureError(e?.message || "Signature upload failed");
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const removeUploadedSignature = () => {
    updateData("consent", { ...data.consent, signature_document_id: null });
    setSignatureError(null);
  };

  const downloadDocument = () => {
    // Create a simple text document for download
    const legalText = `LEGAL DOCUMENT - DISAPPEARANCE REPORT

This document constitutes the legal authorization for the Palestinian Centre for Human Rights to pursue legal action regarding the reported disappearance case.

By signing this document, you acknowledge and agree to the following terms:

1. You authorize the Palestinian Centre for Human Rights to legally pursue this case on your behalf.
2. You confirm that all information provided in this report is accurate to the best of your knowledge.
3. You understand that this case may be subject to legal proceedings and international human rights mechanisms.
4. You consent to the processing of personal data as outlined in our privacy policy.
5. You acknowledge that this report will be handled in accordance with international human rights standards.

Case Reference: ${Date.now()}
Date: ${new Date().toLocaleDateString()}

This document is legally binding and constitutes your formal consent for legal action.`;

    const blob = new Blob([legalText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-document.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateForm = () => {
    // Valid only if a signature document has been uploaded
    return !!data.consent.signature_document_id;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert(t("newCase.step6.alerts.missingSignature"));
      return;
    }

    const consentData = {
      consent_agreed: consentAccepted,
      signature_document_id: data.consent.signature_document_id ?? null,
      priority: data.consent.priority ?? null,
    };
    updateData("consent", { ...data.consent, ...consentData });

    const payload = {
      ...data.detaineeInfo,
      ...data.detentionInfo,
      ...data.clientInfo,
      ...data.delegationInfo,
      ...data.documents,
      ...consentData,
    } as Record<string, any>;

    try {
      setIsSubmitting(true);
      console.log("Step6:submitCase:payload", payload);
      const res = await submitCase(payload, locale);
      console.log("Step6:submitCase:success", res);
      const ref = (res as any)?.data?.case_number ?? "";
      setCaseRef(ref);
      setShowSuccess(true);
      onComplete(currentStep);
    } catch (error: any) {
      console.error("Step6:submitCase:error", error);
      const apiMsg = error?.payload?.error?.message ?? undefined;
      setShowError(apiMsg || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">
          {t("newCase.step6.stepNumber")}
        </span>
        <h2 className="steps__title">{t("newCase.step6.title")}</h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Consent Statement */}
        <section className="steps__section">
          <div className="steps__consent-statement">
            <IconFileText size={20} className="steps__consent-icon" />
            <div className="steps__consent-text">
              {t("newCase.step6.consentText")}
            </div>
          </div>
        </section>

        {/* Legal Document Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.step6.legalDocTitle")}
          </h3>
          <div className="steps__legal-document">
            <textarea
              className="steps__legal-textarea"
              readOnly
              value={`LEGAL DOCUMENT - DISAPPEARANCE REPORT

This document constitutes the legal authorization for the Palestinian Centre for Human Rights to pursue legal action regarding the reported disappearance case.

By signing this document, you acknowledge and agree to the following terms:

1. You authorize the Palestinian Centre for Human Rights to legally pursue this case on your behalf.
2. You confirm that all information provided in this report is accurate to the best of your knowledge.
3. You understand that this case may be subject to legal proceedings and international human rights mechanisms.
4. You consent to the processing of personal data as outlined in our privacy policy.
5. You acknowledge that this report will be handled in accordance with international human rights standards.

Case Reference: ${Date.now()}
Date: ${new Date().toLocaleDateString()}

This document is legally binding and constitutes your formal consent for legal action.`}
            />
            <button
              type="button"
              className="steps__download-button"
              onClick={downloadDocument}
            >
              <IconDownload size={16} />
              <span>{t("newCase.step6.download")}</span>
            </button>
          </div>
        </section>

        {/* Signature Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.step6.signatureTitle")}
          </h3>
          {data.consent.signature_document_id ? (
            <div className="signature__uploaded">
              <button
                type="button"
                className="steps__signature-button"
                onClick={removeUploadedSignature}
              >
                {t("newCase.step6.clear")}
              </button>
              <span className="signature__status signature__status--success">
                {t("newCase.step6.signatureSaved")}
              </span>
            </div>
          ) : (
            <>
              <div className="steps__signature-controls">
                {!signatureError && (
                  <button
                    type="button"
                    className="steps__signature-button"
                    onClick={uploadSignature}
                    disabled={
                      isUploadingSignature || !hasDrawn || !otherDocTypeId
                    }
                  >
                    {isUploadingSignature ? "..." : t("newCase.step6.upload")}
                  </button>
                )}
                <button
                  type="button"
                  className="steps__signature-button"
                  onClick={clearSignature}
                >
                  {t("newCase.step6.clear")}
                </button>
              </div>
              {signatureError && (
                <p className="steps__error" style={{ marginTop: 8 }}>
                  {signatureError}
                </p>
              )}
              <div className="steps__signature-area">
                <canvas
                  ref={canvasRef}
                  className="steps__signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </>
          )}
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
            className="steps__button steps__button--submit"
            onClick={() => setShowConfirm(true)}
            disabled={!validateForm()}
          >
            <span>{isSubmitting ? "..." : t("newCase.step6.submit")}</span>
          </button>
        </div>
      </form>
      <ConfirmSubmitModal
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          void handleSubmit();
        }}
      />
      <LoadingModal isOpen={isSubmitting} />
      <SuccessModal
        isOpen={showSuccess}
        caseRef={caseRef}
        onTrack={() => setShowSuccess(false)}
      />
      <ErrorModal
        isOpen={!!showError}
        message={showError ?? undefined}
        onRetry={() => {
          setShowError(null);
          void handleSubmit();
        }}
        onClose={() => setShowError(null)}
      />
    </div>
  );
}
