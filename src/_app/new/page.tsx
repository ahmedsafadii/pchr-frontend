"use client";

import { useState, useEffect } from "react";
import {
  IconMapPin,
  IconUser,
  IconFileUpload,
  IconMessage,
  IconCheck,
  IconExclamationMark,
} from "@tabler/icons-react";
import Logo from "../components/Logo";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";
import Step5 from "./steps/step5";
import Step6 from "./steps/step6";
import "@/app/css/new-case.css";
import { useTranslations } from "next-globe-gen";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Link from "next/link";
// Types for the case data
export interface CaseData {
  // Step 1: Detainee Information
  detaineeInfo: {
    detainee_name: string;
    detainee_id: string;
    detainee_date_of_birth: string;
    detainee_job: string;
    detainee_health_status: string;
    detainee_marital_status: string;
    detainee_city: string;
    detainee_governorate: string;
    detainee_district: string;
    detainee_street: string;
  };

  // Step 2: Detention/Disappearance Info
  detentionInfo: {
    detention_date: string;
    disappearance_status: string;
    detention_city: string;
    detention_governorate: string;
    detention_district: string;
    detention_street: string;
    detention_circumstances: string;
  };

  // Step 3: Client Info
  clientInfo: {
    client_name: string;
    client_phone: string;
    client_relationship: string;
  };

  // Step 5: Documents Upload
  documents: {
    detainee_document_id: string | null;
    client_document_id: string | null;
    additional_document_ids: string[];
  };

  // Step 4: Delegation & Communication
  delegationInfo: {
    authorized_another_party: boolean;
    previous_delegation: boolean;
    organisation_name: string;
    delegation_date: string | null;
    delegation_notes: string;
  };

  // Step 6: Consent and Submission
  consent: {
    consent_agreed: boolean;
    signature_document_id: string | null;
    priority: string | null;
  };
}

const initialCaseData: CaseData = {
  detaineeInfo: {
    detainee_name: "",
    detainee_id: "",
    detainee_date_of_birth: "",
    detainee_job: "",
    detainee_health_status: "",
    detainee_marital_status: "",
    detainee_city: "",
    detainee_governorate: "",
    detainee_district: "",
    detainee_street: "",
  },
  detentionInfo: {
    detention_date: "",
    disappearance_status: "",
    detention_city: "",
    detention_governorate: "",
    detention_district: "",
    detention_street: "",
    detention_circumstances: "",
  },
  clientInfo: {
    client_name: "",
    client_phone: "",
    client_relationship: "",
  },
  documents: {
    detainee_document_id: null,
    client_document_id: null,
    additional_document_ids: [],
  },
  delegationInfo: {
    authorized_another_party: false,
    previous_delegation: false,
    organisation_name: "",
    delegation_date: null,
    delegation_notes: "",
  },
  consent: {
    consent_agreed: false,
    signature_document_id: null,
    priority: null,
  },
};

// Steps will be defined inside the component to access translations and locale

export default function NewCasePage({ locale = "en" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData] = useState<CaseData>(initialCaseData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [errorSummaries, setErrorSummaries] = useState<Record<number, string[]>>({});
  // reserved for future per-field highlighting if needed
  // const [errorFieldMaps, setErrorFieldMaps] = useState<Record<number, Record<string, string>>>({});
  const t = useTranslations();
  const tt = t as any;

  const steps = [
    {
      id: 1,
      title: t("newCase.step1.title"),
      description: tt("newCase.step1.shortDescription"),
      component: Step1,
      icon: IconUser,
    },
    {
      id: 2,
      title: t("newCase.step2.title"),
      description: tt("newCase.step2.shortDescription"),
      component: Step2,
      icon: IconMapPin,
    },
    {
      id: 3,
      title: t("newCase.step3.title"),
      description: tt("newCase.step3.shortDescription"),
      component: Step3,
      icon: IconUser,
    },
    {
      id: 4,
      title: t("newCase.step4.title"),
      description: tt("newCase.step4.shortDescription"),
      component: Step4,
      icon: IconMessage,
    },
    {
      id: 5,
      title: t("newCase.step5.title"),
      description: tt("newCase.step5.shortDescription"),
      component: Step5,
      icon: IconFileUpload,
    },
    {
      id: 6,
      title: t("newCase.step6.title"),
      description: tt("newCase.step6.shortDescription"),
      component: Step6,
      icon: IconCheck,
    },
  ];


  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("newCaseData");
    const savedStep = localStorage.getItem("newCaseCurrentStep");
    const savedCompletedSteps = localStorage.getItem("newCaseCompletedSteps");

    if (savedData) {
      setCaseData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("newCaseData", JSON.stringify(caseData));
    localStorage.setItem("newCaseCurrentStep", currentStep.toString());
    localStorage.setItem(
      "newCaseCompletedSteps",
      JSON.stringify(completedSteps)
    );
  }, [caseData, currentStep, completedSteps]);

  const updateCaseData = (section: keyof CaseData, data: any) => {
    setCaseData((prev) => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], ...data },
      };
      return updated;
    });
  };

  const markStepCompleted = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps((prev) => [...prev, stepNumber]);
    }
    // Clear error highlight and summaries for this step
    setErrorSteps((prev) => prev.filter((s) => s !== stepNumber));
    setErrorSummaries((prev) => {
      const next = { ...prev };
      delete next[stepNumber];
      return next;
    });
    // clear field maps when implemented
  };

  const canGoToNext = (stepNumber: number) => {
    // For step 1, check if all required fields are filled
    if (stepNumber === 1) {
      const detaineeInfo = caseData.detaineeInfo;
      const isValid = (
        detaineeInfo?.detainee_name?.trim() !== '' &&
        detaineeInfo?.detainee_id?.trim() !== '' &&
        detaineeInfo?.detainee_date_of_birth?.trim() !== '' &&
        detaineeInfo?.detainee_health_status?.trim() !== '' &&
        detaineeInfo?.detainee_marital_status?.trim() !== '' &&
        detaineeInfo?.detainee_city?.trim() !== '' &&
        detaineeInfo?.detainee_governorate?.trim() !== '' &&
        detaineeInfo?.detainee_district?.trim() !== ''
      );
      return isValid;
    }
    
    // For step 2, check if all required fields are filled
    if (stepNumber === 2) {
      const detentionInfo = caseData.detentionInfo;
      const isValid = (
        detentionInfo?.detention_date?.trim() !== '' &&
        detentionInfo?.detention_city?.trim() !== '' &&
        detentionInfo?.detention_governorate?.trim() !== '' &&
        detentionInfo?.detention_district?.trim() !== ''
      );
      return isValid;
    }
    
    // For step 3, check if all required fields are filled
    if (stepNumber === 3) {
      const clientInfo = caseData.clientInfo;
      const isValid = (
        clientInfo?.client_name?.trim() !== '' &&
        clientInfo?.client_phone?.trim() !== '' &&
        clientInfo?.client_relationship?.trim() !== ''
      );
      return isValid;
    }
    
    // For step 4, check if all required fields are filled
    if (stepNumber === 4) {
      const delegationInfo = caseData.delegationInfo;
      const isValid = (
        typeof delegationInfo?.authorized_another_party === 'boolean' &&
        typeof delegationInfo?.previous_delegation === 'boolean'
      );
      return isValid;
    }
    
    // For step 5, documents are optional
    if (stepNumber === 5) {
      return true; // Documents are optional
    }
    
    // For other steps, check if step is completed
    return completedSteps.includes(stepNumber);
  };

  const goToNext = () => {
    if (canGoToNext(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAll = () => {
    setCaseData(initialCaseData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrorSteps([]);
    setErrorSummaries({});
    try {
      localStorage.removeItem("newCaseData");
      localStorage.removeItem("newCaseCurrentStep");
      localStorage.removeItem("newCaseCompletedSteps");
    } catch {}
  };

  const getStepStatus = (stepNumber: number) => {
    if (errorSteps.includes(stepNumber)) {
      return "error";
    }
    if (stepNumber === currentStep) {
      return "current";
    }
    if (completedSteps.includes(stepNumber)) {
      return "completed";
    }
    if (stepNumber < currentStep) {
      return "error"; // Previous step not completed
    }
    return "pending";
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="new-case" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="new-case__container">
        {/* Header */}
        <header className="new-case__header">
          <div className="new-case__logo">
            <Logo />
          </div>
          <div className="new-case__header-controls">
            <Link href="/" className="new-case__back-button">
              <span>{t("newCase.back")}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="new-case__main">
          {/* Left Column - Progress */}
          <aside className="new-case__progress">
            <div className="new-case__progress-card">
              <h1 className="new-case__title">{tt("newCase.sidebar.title")}</h1>
              <p className="new-case__description">{tt("newCase.sidebar.description")}</p>

              <div className="new-case__steps">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="new-case__step">
                      <div className="new-case__step-connector">
                        <div
                          className={`new-case__step-circle new-case__step-circle--${getStepStatus(
                            step.id
                          )}`}
                        >
                          {getStepStatus(step.id) === "error" && (
                            <IconExclamationMark size={18} />
                          )}
                          {getStepStatus(step.id) === "completed" && (
                            <IconCheck size={18} />
                          )}
                          {getStepStatus(step.id) === "current" && (
                            <StepIcon size={18} />
                          )}
                          {getStepStatus(step.id) === "pending" && step.id}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`new-case__step-line new-case__step-line--${getStepStatus(
                              step.id
                            )}`}
                          ></div>
                        )}
                      </div>
                      <div className="new-case__step-content">
                        <h3 className="new-case__step-title">{step.title}</h3>
                        <p className="new-case__step-description">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column - Form */}
          <section className="new-case__form">
            <div className="new-case__form-card">
              <CurrentStepComponent
                data={caseData}
                updateData={updateCaseData}
                onComplete={markStepCompleted}
                isCompleted={completedSteps.includes(currentStep)}
                onNext={goToNext}
                onPrevious={goToPrevious}
                canGoNext={canGoToNext(currentStep)}
                currentStep={currentStep}
                totalSteps={steps.length}
                locale={locale}
                onResetAll={resetAll}
                externalErrors={errorSummaries[currentStep] || []}
                onValidationErrors={(payload: { steps: number[]; summaries: Record<number, string[]> }) => {
                  const { steps, summaries } = payload as any;
                  setErrorSteps(steps);
                  setErrorSummaries(summaries);
                  if (steps.length > 0) setCurrentStep(Math.min(...steps));
                }}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
