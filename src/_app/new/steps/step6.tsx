"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import SignatureCanvas from "react-signature-canvas";
import { submitCase, uploadDocumentFile } from "../../services/api";
import { formatDateWithLocale } from "../../utils/dateUtils";
import ConfirmSubmitModal from "../modals/ConfirmSubmitModal";
import LoadingModal from "../modals/LoadingModal";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";
import { IconDownload, IconFileText } from "@tabler/icons-react";
import { CaseData } from "../page";

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
  onResetAll?: () => void;
  onValidationErrors?: (payload: {
    steps: number[];
    summaries: Record<number, string[]>;
  }) => void;
}

export default function Step6({
  data,
  updateData,
  onComplete,
  onPrevious,
  currentStep,
  onResetAll,
  onValidationErrors,
}: Step6Props) {
  const [consentAccepted] = useState(true);
  const signatureRef = useRef<SignatureCanvas>(null);
  const t = useTranslations();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [caseRef, setCaseRef] = useState<string>("");

  const [hasDrawn, setHasDrawn] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const signatureDocType = "signature";

  // Hydrate signature state if already uploaded
  useEffect(() => {
    const signatureMeta = data.documents?.display_meta?.signature;
    const hasSignatureId = data.consent?.signature_document_id;

    if ((hasSignatureId || signatureMeta?.id) && !hasDrawn) {

      setHasDrawn(true); // Mark as drawn so upload button becomes available

      // If we have metadata but no consent ID, update consent
      if (!hasSignatureId && signatureMeta?.id) {
        updateData("consent", {
          ...data.consent,
          signature_document_id: signatureMeta.id,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.documents, data.consent, hasDrawn]);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }

    // Reset states - this will reset validation too
    setHasDrawn(false);
    setSignatureError(null);

    // Also clear any uploaded signature data
    updateData("consent", {
      ...data.consent,
      signature_document_id: null,
    });

    // Remove signature metadata
    if (data.documents?.display_meta?.signature) {
      const newDisplayMeta = { ...data.documents.display_meta };
      delete newDisplayMeta.signature;
      updateData("documents", {
        ...data.documents,
        display_meta: newDisplayMeta,
      });
    }


  };



  const removeUploadedSignature = () => {
    updateData("consent", { ...data.consent, signature_document_id: null });
    setSignatureError(null);
  };

  const downloadDocument = () => {
    // Create a simple text document for download
    const legalText = `${t("legalDocument.title")}

${t("legalDocument.description")}

${t("legalDocument.termsIntro")}

1. ${t("legalDocument.term1")}
2. ${t("legalDocument.term2")}
3. ${t("legalDocument.term3")}
4. ${t("legalDocument.term4")}
5. ${t("legalDocument.term5")}

${t("legalDocument.caseReference")} ${Date.now()}
${t("legalDocument.date")} ${formatDateWithLocale(new Date(), locale)}

${t("legalDocument.binding")}`;

    const blob = new Blob([legalText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t("legalDocument.downloadFilename");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateForm = () => {
    // Valid if signature is uploaded OR user has drawn something
    return !!data.consent.signature_document_id || hasDrawn;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert(t("newCase.step6.alerts.missingSignature"));
      return;
    }

    // Smart upload logic: Upload signature if drawn but not yet uploaded
    let finalSignatureId = data.consent.signature_document_id;

    if (
      !finalSignatureId &&
      hasDrawn &&
      signatureRef.current &&
      !signatureRef.current.isEmpty()
    ) {
      try {

        setIsSubmitting(true); // Show loading during upload

        // Get signature as blob
        const canvas = signatureRef.current.getCanvas();
        const blob: Blob | null = await new Promise((resolve) =>
          canvas.toBlob(resolve as BlobCallback, "image/png")
        );

        if (!blob) throw new Error("Failed to get signature blob");

        const file = new File([blob], `signature-${Date.now()}.png`, {
          type: "image/png",
        });

        const res = await uploadDocumentFile(signatureDocType, file, locale);
        finalSignatureId = (res?.data?.document_id ?? null) as string | null;

        if (!finalSignatureId)
          throw new Error("Upload did not return document_id");



        // Update data with the new signature ID
        updateData("consent", {
          ...data.consent,
          signature_document_id: finalSignatureId,
        });

        // Save signature metadata for persistence
        updateData("documents", {
          ...data.documents,
          display_meta: {
            ...(data.documents?.display_meta || {}),
            signature: {
              id: finalSignatureId,
              name: file.name,
              size: file.size,
              type: file.type,
              status: "uploaded",
            },
          },
        });
      } catch (error: any) {

        alert(
          t("messages.errors.failedToUploadSignature") + ": " + (error?.message || t("messages.errors.unknownError"))
        );
        setIsSubmitting(false);
        return;
      }
    }

    const consentData = {
      consent_agreed: consentAccepted,
      signature_document_id: finalSignatureId,
      priority: data.consent.priority ?? null,
    };
    updateData("consent", { ...data.consent, ...consentData });

    // Only include the required document ID fields in the payload
    const sanitizedDocuments = {
      detainee_document_id: data.documents?.detainee_document_id ?? null,
      client_document_id: data.documents?.client_document_id ?? null,
      additional_document_ids: Array.isArray(
        data.documents?.additional_document_ids
      )
        ? data.documents.additional_document_ids
        : [],
    } as const;

    const payload = {
      ...data.detaineeInfo,
      ...data.detentionInfo,
      ...data.clientInfo,
      ...data.delegationInfo,
      ...sanitizedDocuments,
      ...consentData,
    } as Record<string, any>;

    try {
      setIsSubmitting(true);
      const res = await submitCase(payload, locale);
      const ref = (res as any)?.data?.case_number ?? "";
      setCaseRef(ref);
      setShowSuccess(true);
      onComplete(currentStep);
    } catch (error: any) {

      // If 422, map backend error keys to steps
      const status = error?.status ?? error?.payload?.statusCode;
      const details = error?.payload?.error?.details as any;
      if (status === 422 && details) {
        // Helper to map a field name to the step number in our wizard
        const mapFieldToStep = (field: string): number | null => {
          const step1 = new Set([
            "detainee_name",
            "detainee_id",
            "detainee_date_of_birth",
            "detainee_job",
            "detainee_health_status",
            "detainee_marital_status",
            "detainee_location",
            "detainee_city",
            "detainee_governorate",
            "detainee_district",
            "detainee_street",
          ]);
          const step2 = new Set([
            "detention_date",
            "disappearance_status",
            "detention_location",
            "detention_city",
            "detention_governorate",
            "detention_district",
            "detention_street",
            "detention_circumstances",
          ]);
          const step3 = new Set([
            "client_name",
            "client_id",
            "client_phone",
            "client_relationship",
          ]);
          const step4 = new Set([
            "authorized_another_party",
            "previous_delegation",
            "organisation_name",
            "delegation_date",
            "delegation_notes",
          ]);
          const step5 = new Set([
            "detainee_document_id",
            "client_document_id",
            "additional_document_ids",
          ]);
          const step6 = new Set([
            "consent_agreed",
            "signature_document_id",
            "priority",
          ]);

          if (step1.has(field)) return 1;
          if (step2.has(field)) return 2;
          if (step3.has(field)) return 3;
          if (step4.has(field)) return 4;
          if (step5.has(field)) return 5;
          if (step6.has(field)) return 6;

          // Fallback by prefix heuristics
          if (field.startsWith("detainee_")) return 1;
          if (field.startsWith("detention_") || field.includes("disappearance"))
            return 2;
          if (field.startsWith("client_")) return 3;
          if (field.includes("delegation") || field.includes("organisation"))
            return 4;
          if (field.includes("document")) return 5;
          if (field.includes("consent") || field.includes("signature"))
            return 6;
          return null;
        };

        const steps: number[] = [];
        const summaries: Record<number, string[]> = {};

        const pushSummary = (step: number, messages: string[]) => {
          if (!summaries[step]) summaries[step] = [];
          const merged = [...summaries[step], ...messages];
          summaries[step] = Array.from(new Set(merged));
          if (!steps.includes(step)) steps.push(step);
        };

        // Case A: API already groups by step keys
        if (
          details.step1_detainee_info ||
          details.step2_detention_info ||
          details.step3_client_info ||
          details.step4_delegation_info ||
          details.step5_documents_info ||
          details.step6_consent_info
        ) {
          if (details.step1_detainee_info)
            pushSummary(
              1,
              Object.values(
                details.step1_detainee_info as Record<string, string[]>
              ).flat()
            );
          if (details.step2_detention_info)
            pushSummary(
              2,
              Object.values(
                details.step2_detention_info as Record<string, string[]>
              ).flat()
            );
          if (details.step3_client_info)
            pushSummary(
              3,
              Object.values(
                details.step3_client_info as Record<string, string[]>
              ).flat()
            );
          if (details.step4_delegation_info)
            pushSummary(
              4,
              Object.values(
                details.step4_delegation_info as Record<string, string[]>
              ).flat()
            );
          if (details.step5_documents_info)
            pushSummary(
              5,
              Object.values(
                details.step5_documents_info as Record<string, string[]>
              ).flat()
            );
          if (details.step6_consent_info)
            pushSummary(
              6,
              Object.values(
                details.step6_consent_info as Record<string, string[]>
              ).flat()
            );
        } else if (typeof details === "object") {
          // Case B: Flat field -> messages mapping like { detainee_job: ["Must be a valid UUID."] }
          Object.entries(details as Record<string, string[] | string>).forEach(
            ([field, msgs]) => {
              const step = mapFieldToStep(field);
              const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
              if (step) pushSummary(step, messages);
            }
          );
        }

        if (steps.length > 0) {
          onValidationErrors?.({ steps, summaries });
          return;
        }
      }
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
Date: ${formatDateWithLocale(new Date(), locale)}

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
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: "steps__signature-canvas",
                    style: {
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      width: "100%",
                      height: "200px",
                    },
                  }}
                  // Smoothing and quality options for iPad-like drawing
                  velocityFilterWeight={0.7} // Higher = smoother lines (0-1)
                  minWidth={0.5} // Minimum line width
                  maxWidth={2.5} // Maximum line width
                  throttle={16} // Throttle drawing events (60fps)
                  minDistance={5} // Minimum distance between points
                  dotSize={1} // Size of dots when tapping
                  penColor="#000000" // Pen color
                  backgroundColor="rgba(255,255,255,0)" // Transparent background
                  onBegin={() => {
                    setHasDrawn(true);
                  }}
                  onEnd={() => {
                    // Signature drawing ended
                  }}
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
        onTrack={() => {
          setShowSuccess(false);
          onResetAll?.();
        }}
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
