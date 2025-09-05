"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IconMapPin,
  IconUser,
  IconFileUpload,
  IconMessage,
  IconCheck,
  IconExclamationMark,
  IconScale,
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
    detainee_job: string; // store job id
    detainee_health_status: string;
    detainee_marital_status: string;
    detainee_gender: string;
    detainee_location: string;
    detainee_locality: string;
    detainee_governorate: string;
    detainee_district: string;
    detainee_street: string;
  };

  // Step 2: Detention/Disappearance Info
  detentionInfo: {
    detention_date: string;
    disappearance_status: string;
    detention_location: string;
    detention_locality: string;
    detention_governorate: string;
    detention_district: string;
    detention_street: string;
    detention_circumstances: string;
  };

  // Step 3: Client Info
  clientInfo: {
    client_name: string;
    client_id: string;
    client_phone: string;
    client_whatsapp: string;
    client_relationship: string;
  };

  // Step 5: Documents Upload
  documents: {
    detainee_document_id: string | null;
    client_document_id: string | null;
    additional_document_ids: string[];
    display_meta?: {
      detainee?: { name: string; size: number };
      client?: { name: string; size: number };
      additional?: Array<{
        id: string;
        name: string;
        size: number;
        type: string;
        status: string;
      }>;
      detainee_id?: {
        id: string;
        name: string;
        size: number;
        type: string;
        status: string;
      };
      client_id?: {
        id: string;
        name: string;
        size: number;
        type: string;
        status: string;
      };
      signature?: {
        id: string;
        name: string;
        size: number;
        type: string;
        status: string;
      };
    };
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

// Persistent storage controls
const NEW_CASE_STATE_VERSION = 2;
const NEW_CASE_KEYS = {
  data: "newCaseData",
  step: "newCaseCurrentStep",
  completed: "newCaseCompletedSteps",
  version: "newCaseVersion",
} as const;

function clearPersistedCaseState() {
  try {
    localStorage.removeItem(NEW_CASE_KEYS.data);
    localStorage.removeItem(NEW_CASE_KEYS.step);
    localStorage.removeItem(NEW_CASE_KEYS.completed);
    localStorage.removeItem(NEW_CASE_KEYS.version);
  } catch {
    // Ignore localStorage errors
  }
}

const initialCaseData: CaseData = {
  detaineeInfo: {
    detainee_name: "",
    detainee_id: "",
    detainee_date_of_birth: "",
    detainee_job: "",
    detainee_health_status: "",
    detainee_marital_status: "",
    detainee_gender: "",
    detainee_location: "gaza_strip",
    detainee_locality: "",
    detainee_governorate: "",
    detainee_district: "",
    detainee_street: "",
  },
  detentionInfo: {
    detention_date: "",
    detention_location: "gaza_strip",
    disappearance_status: "",
    detention_locality: "",
    detention_governorate: "",
    detention_district: "",
    detention_street: "",
    detention_circumstances: "",
  },
  clientInfo: {
    client_name: "",
    client_id: "",
    client_phone: "",
    client_whatsapp: "",
    client_relationship: "",
  },
  documents: {
    detainee_document_id: null,
    client_document_id: null,
    additional_document_ids: [],
    display_meta: undefined,
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

export default function NewCasePage({ locale = "ar" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData] = useState<CaseData>(initialCaseData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [errorSummaries, setErrorSummaries] = useState<
    Record<number, string[]>
  >({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // reserved for future per-field highlighting if needed
  // const [errorFieldMaps, setErrorFieldMaps] = useState<Record<number, Record<string, string>>>({});
  const t = useTranslations();
  const tt = t as any;

  // shallow compare helper to avoid unnecessary state updates
  function shallowEqual(objA: any, objB: any) {
    if (objA === objB) return true;
    if (!objA || !objB) return false;
    const aKeys = Object.keys(objA);
    const bKeys = Object.keys(objB);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (objA[key] !== objB[key]) return false;
    }
    return true;
  }

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
    try {
      const savedVersion = localStorage.getItem(NEW_CASE_KEYS.version);
      // Only clear data if version is explicitly different and not null/undefined
      if (
        savedVersion !== null &&
        savedVersion !== String(NEW_CASE_STATE_VERSION)
      ) {
        clearPersistedCaseState();
        return;
      }

      const savedData = localStorage.getItem(NEW_CASE_KEYS.data);
      const savedStep = localStorage.getItem(NEW_CASE_KEYS.step);
      const savedCompletedSteps = localStorage.getItem(NEW_CASE_KEYS.completed);

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (
            parsed &&
            typeof parsed === "object" &&
            parsed.detaineeInfo &&
            parsed.detentionInfo
          ) {
            setCaseData(parsed);
          } else {
            clearPersistedCaseState();
            return;
          }
        } catch {
          clearPersistedCaseState();
          return;
        }
      }

      // Ensure version is always saved to prevent future version mismatches
      try {
        localStorage.setItem(
          NEW_CASE_KEYS.version,
          String(NEW_CASE_STATE_VERSION)
        );
      } catch {
        // Ignore localStorage errors
      }

      if (savedStep) {
        const n = parseInt(savedStep);
        const clamped = isNaN(n) ? 1 : Math.min(Math.max(n, 1), 6);
        setCurrentStep(clamped);
      }

      if (savedCompletedSteps) {
        try {
          const parsed = JSON.parse(savedCompletedSteps);
          if (Array.isArray(parsed)) {
            const filtered = parsed
              .map((x: any) => Number(x))
              .filter((x: number) => Number.isInteger(x) && x >= 1 && x <= 6);
            setCompletedSteps(Array.from(new Set(filtered)));
          }
        } catch {
          // ignore invalid completed steps
        }
      }
    } catch {
      clearPersistedCaseState();
    }

    // Mark data as loaded after attempting to load from localStorage
    setIsDataLoaded(true);
  }, [setIsDataLoaded]);

  // Check if completed steps should be reverted to pending
  useEffect(() => {
    if (!isDataLoaded) {
      return;
    }

    const stepsToRevert: number[] = [];
    
    // Check each completed step to see if it should be reverted
    completedSteps.forEach(stepNumber => {
      if (stepNumber === 5 && !canGoToNext(5)) {
        stepsToRevert.push(stepNumber);
      }
    });

    // Remove reverted steps from completedSteps
    if (stepsToRevert.length > 0) {
      setCompletedSteps(prev => prev.filter(step => !stepsToRevert.includes(step)));
    }
  }, [caseData, completedSteps, isDataLoaded]);

  // Save data to localStorage whenever it changes (but only after data is loaded)
  useEffect(() => {
    // Don't save until data is loaded to prevent overwriting loaded data
    if (!isDataLoaded) {
      return;
    }

    try {
      localStorage.setItem(NEW_CASE_KEYS.data, JSON.stringify(caseData));
      localStorage.setItem(NEW_CASE_KEYS.step, currentStep.toString());
      localStorage.setItem(
        NEW_CASE_KEYS.completed,
        JSON.stringify(completedSteps)
      );
      localStorage.setItem(
        NEW_CASE_KEYS.version,
        String(NEW_CASE_STATE_VERSION)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [caseData, currentStep, completedSteps, isDataLoaded]);

  const updateCaseData = useCallback((section: keyof CaseData, data: any) => {
    setCaseData((previous) => {
      const nextSection = { ...(previous as any)[section], ...data };
      const hasChanged = !shallowEqual((previous as any)[section], nextSection);
      if (!hasChanged) {
        return previous; // prevent re-render loop when nothing actually changed
      }
      return {
        ...previous,
        [section]: nextSection,
      } as CaseData;
    });
  }, []);

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

  const canGoToNext = (stepNumber: number): boolean => {
    // For step 1, check if all required fields are filled
    if (stepNumber === 1) {
      const detaineeInfo = caseData.detaineeInfo;
      const isValid =
        detaineeInfo?.detainee_name?.trim() !== "" &&
        detaineeInfo?.detainee_id?.trim() !== "" &&
        detaineeInfo?.detainee_date_of_birth?.trim() !== "" &&
        detaineeInfo?.detainee_job?.trim() !== "" &&
        detaineeInfo?.detainee_health_status?.trim() !== "" &&
        detaineeInfo?.detainee_marital_status?.trim() !== "" &&
        detaineeInfo?.detainee_gender?.trim() !== "" &&
        detaineeInfo?.detainee_location?.trim() !== "" &&
        detaineeInfo?.detainee_locality?.trim() !== "" &&
        detaineeInfo?.detainee_governorate?.trim() !== "" &&
        detaineeInfo?.detainee_district?.trim() !== "";
      return isValid;
    }

    // For step 2, check if all required fields are filled
    if (stepNumber === 2) {
      const detentionInfo = caseData.detentionInfo;
      const isValid =
        detentionInfo?.detention_date?.trim() !== "" &&
        detentionInfo?.detention_location?.trim() !== "" &&
        detentionInfo?.detention_locality?.trim() !== "" &&
        detentionInfo?.detention_governorate?.trim() !== "" &&
        detentionInfo?.detention_district?.trim() !== "";
      return isValid;
    }

    // For step 3, check if all required fields are filled
    if (stepNumber === 3) {
      const clientInfo = caseData.clientInfo;
      const isValid =
        clientInfo?.client_name?.trim() !== "" &&
        clientInfo?.client_id?.trim() !== "" &&
        clientInfo?.client_phone?.trim() !== "" &&
        clientInfo?.client_whatsapp?.trim() !== "" &&
        clientInfo?.client_relationship?.trim() !== "";
      return isValid;
    }

    // For step 4, check if all required fields are filled
    if (stepNumber === 4) {
      const delegationInfo = caseData.delegationInfo;
      
      // Always require authorized_another_party to be answered
      if (typeof delegationInfo?.authorized_another_party !== "boolean") {
        return false;
      }
      
      // If authorized_another_party is true, check additional requirements
      if (delegationInfo.authorized_another_party) {
        // Require organisation_name
        if (!delegationInfo.organisation_name || delegationInfo.organisation_name.trim() === '') {
          return false;
        }
        
        // Require previous_delegation to be answered
        if (typeof delegationInfo.previous_delegation !== "boolean") {
          return false;
        }
        
        // If previous_delegation is true, require delegation_date
        if (delegationInfo.previous_delegation) {
          if (!delegationInfo.delegation_date || delegationInfo.delegation_date.trim() === '') {
            return false;
          }
        }
      }
      
      return true;
    }

    // For step 5, require only client ID document to be uploaded
    // Detainee ID is now optional
    if (stepNumber === 5) {
      const documents = caseData.documents;
      // Check both document IDs and metadata for uploaded files
      const hasClientId =
        !!documents?.client_document_id ||
        !!documents?.display_meta?.client_id?.id;

      return hasClientId;
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

  const goToStep = (stepNumber: number) => {
    // Allow navigation to completed steps, error steps, current step, or the next step after a completed step
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      if (completedSteps.includes(stepNumber) || 
          errorSteps.includes(stepNumber) || 
          stepNumber === currentStep) {
        setCurrentStep(stepNumber);
      } else if (stepNumber === currentStep + 1 && canGoToNext(currentStep)) {
        // Allow going to next step if current step can proceed
        setCurrentStep(stepNumber);
      } else if (stepNumber === 6 && (completedSteps.includes(5) || canGoToNext(5))) {
        // Special case: Allow going to step 6 (final step) when step 5 is completed or valid
        setCurrentStep(stepNumber);
      }
    }
  };

  const resetAll = () => {
    setCaseData(initialCaseData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrorSteps([]);
    setErrorSummaries({});
    clearPersistedCaseState();
  };

  const getStepStatus = (stepNumber: number) => {
    if (errorSteps.includes(stepNumber)) {
      return "error";
    }
    if (stepNumber === currentStep) {
      return "current";
    }
    if (completedSteps.includes(stepNumber)) {
      // Check if a completed step should be reverted to pending
      if (stepNumber === 5 && !canGoToNext(5)) {
        return "pending";
      }
      return "completed";
    }
    if (stepNumber < currentStep && !completedSteps.includes(stepNumber)) {
      return "error"; // Previous step not completed
    }
    return "pending";
  };


  const CurrentStepComponent = steps[currentStep - 1].component;

  // Show loading state while data is being loaded
  if (!isDataLoaded) {
    return (
      <div className="new-case" dir={locale === "ar" ? "rtl" : "ltr"}>
        <div className="new-case__container">
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="new-case" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="new-case__container">
        {/* Header */}
        <header className="new-case__header">
          <div className="new-case__logo">
            <Logo />
          </div>
          <div className="new-case__header-controls">
            <Link href={`/${locale}`} className="new-case__back-button">
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
              <p className="new-case__description">
                {tt("newCase.sidebar.description")
                  .split("https://wa.me/970597167306")
                  .map((part: string, index: number, array: string[]) => {
                    if (index === array.length - 1) {
                      return part;
                    }
                    return (
                      <span key={index}>
                        {part}
                        <a
                          href="https://wa.me/970597167306"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-link"
                        >
                          https://wa.me/970597167306
                        </a>
                      </span>
                    );
                  })}
              </p>

              <div className="new-case__steps">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="new-case__step">
                      <div className="new-case__step-connector">
                        <div
                          className={`new-case__step-circle new-case__step-circle--${getStepStatus(
                            step.id
                          )} ${
                            getStepStatus(step.id) === "completed" ||
                            getStepStatus(step.id) === "error" ||
                            getStepStatus(step.id) === "current" ||
                            (step.id === currentStep + 1 &&
                              canGoToNext(currentStep)) ||
                            (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                              ? "new-case__step-circle--clickable"
                              : ""
                          }`}
                          onClick={() => {
                            if (getStepStatus(step.id) === "completed") {
                              goToStep(step.id);
                            } else if (getStepStatus(step.id) === "error") {
                              goToStep(step.id);
                            } else if (getStepStatus(step.id) === "current") {
                              goToStep(step.id);
                            } else if (
                              step.id === currentStep + 1 &&
                              canGoToNext(currentStep)
                            ) {
                              goToStep(step.id);
                            } else if (
                              step.id === 6 && 
                              (completedSteps.includes(5) || canGoToNext(5))
                            ) {
                              goToStep(step.id);
                            }
                          }}
                          style={{
                            cursor:
                              getStepStatus(step.id) === "completed" ||
                              getStepStatus(step.id) === "error" ||
                              getStepStatus(step.id) === "current" ||
                              (step.id === currentStep + 1 &&
                                canGoToNext(currentStep)) ||
                              (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                                ? "pointer"
                                : "default",
                          }}
                          role={
                            getStepStatus(step.id) === "completed" ||
                            getStepStatus(step.id) === "error" ||
                            getStepStatus(step.id) === "current" ||
                            (step.id === currentStep + 1 &&
                              canGoToNext(currentStep)) ||
                            (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                              ? "button"
                              : undefined
                          }
                          tabIndex={
                            getStepStatus(step.id) === "completed" ||
                            getStepStatus(step.id) === "error" ||
                            getStepStatus(step.id) === "current" ||
                            (step.id === currentStep + 1 &&
                              canGoToNext(currentStep)) ||
                            (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                              ? 0
                              : undefined
                          }
                          aria-label={
                            getStepStatus(step.id) === "completed" ||
                            getStepStatus(step.id) === "error" ||
                            getStepStatus(step.id) === "current" ||
                            (step.id === currentStep + 1 &&
                              canGoToNext(currentStep)) ||
                            (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                              ? `Go to step ${step.id}: ${step.title}`
                              : undefined
                          }
                          onKeyDown={(e) => {
                            if (
                              (getStepStatus(step.id) === "completed" ||
                                getStepStatus(step.id) === "error" ||
                                getStepStatus(step.id) === "current" ||
                                (step.id === currentStep + 1 &&
                                  canGoToNext(currentStep)) ||
                                (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))) &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              goToStep(step.id);
                            }
                          }}
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
                          {getStepStatus(step.id) === "pending" && step.id === currentStep && (
                            <StepIcon size={18} />
                          )}
                          {getStepStatus(step.id) === "pending" && step.id !== currentStep && step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)) && (
                            <IconScale size={18} />
                          )}
                          {getStepStatus(step.id) === "pending" && step.id !== currentStep && !(step.id === 6 && (completedSteps.includes(5) || canGoToNext(5))) && (
                            step.id
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`new-case__step-line new-case__step-line--${getStepStatus(
                              step.id
                            )}`}
                          ></div>
                        )}
                      </div>
                      <div
                        className={`new-case__step-content ${
                          getStepStatus(step.id) === "completed" ||
                          getStepStatus(step.id) === "error" ||
                          getStepStatus(step.id) === "current" ||
                          (step.id === currentStep + 1 &&
                            canGoToNext(currentStep)) ||
                          (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                            ? "new-case__step-content--clickable"
                            : ""
                        }`}
                        onClick={() => {
                          if (getStepStatus(step.id) === "completed") {
                            goToStep(step.id);
                          } else if (getStepStatus(step.id) === "error") {
                            goToStep(step.id);
                          } else if (getStepStatus(step.id) === "current") {
                            goToStep(step.id);
                          } else if (
                            step.id === currentStep + 1 &&
                            canGoToNext(currentStep)
                          ) {
                            goToStep(step.id);
                          } else if (
                            step.id === 6 && 
                            (completedSteps.includes(5) || canGoToNext(5))
                          ) {
                            goToStep(step.id);
                          }
                        }}
                        style={{
                          cursor:
                            getStepStatus(step.id) === "completed" ||
                            getStepStatus(step.id) === "error" ||
                            getStepStatus(step.id) === "current" ||
                            (step.id === currentStep + 1 &&
                              canGoToNext(currentStep)) ||
                            (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                              ? "pointer"
                              : "default",
                        }}
                        role={
                          getStepStatus(step.id) === "completed" ||
                          getStepStatus(step.id) === "error" ||
                          getStepStatus(step.id) === "current" ||
                          (step.id === currentStep + 1 &&
                            canGoToNext(currentStep)) ||
                          (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                            ? "button"
                            : undefined
                        }
                        tabIndex={
                          getStepStatus(step.id) === "completed" ||
                          getStepStatus(step.id) === "error" ||
                          getStepStatus(step.id) === "current" ||
                          (step.id === currentStep + 1 &&
                            canGoToNext(currentStep)) ||
                          (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                            ? 0
                            : undefined
                        }
                        aria-label={
                          getStepStatus(step.id) === "completed" ||
                          getStepStatus(step.id) === "error" ||
                          getStepStatus(step.id) === "current" ||
                          (step.id === currentStep + 1 &&
                            canGoToNext(currentStep)) ||
                          (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))
                            ? `Go to step ${step.id}: ${step.title}`
                            : undefined
                        }
                        onKeyDown={(e) => {
                          if (
                            (getStepStatus(step.id) === "completed" ||
                              getStepStatus(step.id) === "error" ||
                              getStepStatus(step.id) === "current" ||
                              (step.id === currentStep + 1 &&
                                canGoToNext(currentStep)) ||
                              (step.id === 6 && (completedSteps.includes(5) || canGoToNext(5)))) &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            goToStep(step.id);
                          }
                        }}
                      >
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
                completedSteps={completedSteps}
                onResetAll={resetAll}
                externalErrors={errorSummaries[currentStep] || []}
                onValidationErrors={(payload: {
                  steps: number[];
                  summaries: Record<number, string[]>;
                }) => {
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
