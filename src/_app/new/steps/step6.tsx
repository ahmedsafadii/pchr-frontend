"use client";

import { useState, useEffect, useRef } from "react";
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
}

export default function Step6({
  data,
  updateData,
  onComplete,
  onPrevious,
  currentStep,
  locale = "en",
}: Step6Props) {
  const [consentAccepted] = useState(true);
  const [signature, setSignature] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

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
  };

  const uploadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL("image/png");
    setSignature(signatureData);
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
    return consentAccepted && signature !== "";
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const consentData = {
        consentAccepted,
        signature,
        submissionDate: new Date().toISOString(),
      };
      
      updateData("consent", consentData);
      onComplete(currentStep);
      
      // Here you would typically submit the case data to the server
      console.log("Case submitted successfully!", data);
      
      // You could redirect to a success page or show a success message
      alert(locale === "ar" ? "تم إرسال التقرير بنجاح!" : "Report submitted successfully!");
    } else {
      alert(locale === "ar" ? "يرجى الموافقة على الشروط وتوقيع المستند" : "Please accept the terms and sign the document");
    }
  };

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 6</span>
        <h2 className="steps__title">
          {locale === "ar" ? "الموافقة والإرسال" : "Consent and Submission"}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Consent Statement */}
        <section className="steps__section">
          <div className="steps__consent-statement">
            <IconFileText size={20} className="steps__consent-icon" />
            <div className="steps__consent-text">
              {locale === "ar"
                ? "أوافق على تفويض المركز الفلسطيني لحقوق الإنسان لمتابعة القضية قانونياً..."
                : "I agree to authorize the Palestinian Center for Human Rights to legally pursue..."}
            </div>
          </div>
        </section>

        {/* Legal Document Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {locale === "ar" ? "المستند القانوني" : "Legal document"}
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
              <span>
                {locale === "ar" ? "تحميل المستند" : "Download document"}
              </span>
            </button>
          </div>
        </section>

        {/* Signature Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {locale === "ar" ? "توقيعك" : "Your Signature"}
          </h3>
          <div className="steps__signature-controls">
            <button
              type="button"
              className="steps__signature-button"
              onClick={uploadSignature}
            >
              {locale === "ar" ? "رفع" : "Upload"}
            </button>
            <button
              type="button"
              className="steps__signature-button"
              onClick={clearSignature}
            >
              {locale === "ar" ? "مسح" : "Clear"}
            </button>
          </div>
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
            className="steps__button steps__button--submit"
            onClick={handleSubmit}
            disabled={!validateForm()}
          >
            <span>{locale === "ar" ? "إرسال" : "Send"}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 