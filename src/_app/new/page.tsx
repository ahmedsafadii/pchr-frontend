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
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    job: string;
    healthStatus: string;
    maritalStatus: string;
    city: string;
    governorate: string;
    district: string;
    streetName: string;
  };

  // Step 2: Detention/Disappearance Info
  detentionInfo: {
    disappearanceDate: string;
    disappearanceStatus: string;
    city: string;
    governorate: string;
    district: string;
    streetName: string;
    disappearanceCircumstances: string;
  };

  // Step 3: Client Info
  clientInfo: {
    fullName: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    address: string;
    idNumber: string;
  };

  // Step 4: Documents Upload
  documents: {
    idCard: File | null;
    photos: File[];
    otherDocuments: File[];
  };

  // Step 5: Delegation & Communication
  delegationInfo: {
    priorEfforts: string;
    contactPreferences: string;
    preferredLanguage: string;
    emergencyContact: string;
    additionalNotes: string;
  };

  // Step 6: Consent and Submission
  consent: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    dataProcessingAccepted: boolean;
  };
}

const initialCaseData: CaseData = {
  detaineeInfo: {
    fullName: "",
    idNumber: "",
    dateOfBirth: "",
    job: "",
    healthStatus: "",
    maritalStatus: "",
    city: "",
    governorate: "",
    district: "",
    streetName: "",
  },
  detentionInfo: {
    disappearanceDate: "",
    disappearanceStatus: "",
    city: "",
    governorate: "",
    district: "",
    streetName: "",
    disappearanceCircumstances: "",
  },
  clientInfo: {
    fullName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    address: "",
    idNumber: "",
  },
  documents: {
    idCard: null,
    photos: [],
    otherDocuments: [],
  },
  delegationInfo: {
    priorEfforts: "",
    contactPreferences: "",
    preferredLanguage: "",
    emergencyContact: "",
    additionalNotes: "",
  },
  consent: {
    termsAccepted: false,
    privacyAccepted: false,
    dataProcessingAccepted: false,
  },
};

const steps = [
  {
    id: 1,
    title: "Detainee information",
    description: "Collect Basic Identity And Status Of The Missing Person.",
    component: Step1,
    icon: IconUser,
  },
  {
    id: 2,
    title: "Detention/Disappearance Info",
    description: "Record Where, When, And How The Person Went Missing.",
    component: Step2,
    icon: IconMapPin,
  },
  {
    id: 3,
    title: "Client info",
    description: "Capture Who Is Reporting The Case.",
    component: Step3,
    icon: IconUser,
  },
  {
    id: 4,
    title: "Documents upload",
    description: "Ensure Identity Validation And Legal Handling.",
    component: Step4,
    icon: IconFileUpload,
  },
  {
    id: 5,
    title: "Delegation & Communication",
    description: "Understand Any Prior Efforts Made And Contact Preferences.",
    component: Step5,
    icon: IconMessage,
  },
  {
    id: 6,
    title: "Consent and Submission",
    description: "Obtain Legal Authorization.",
    component: Step6,
    icon: IconCheck,
  },
];

export default function NewCasePage({ locale = "en" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData] = useState<CaseData>(initialCaseData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const t = useTranslations();


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
    console.log('updateCaseData called:', { section, data });
    setCaseData((prev) => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], ...data },
      };
      console.log('Updated caseData:', updated);
      return updated;
    });
  };

  const markStepCompleted = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps((prev) => [...prev, stepNumber]);
    }
  };

  const canGoToNext = (stepNumber: number) => {
    // For step 1, check if all required fields are filled
    if (stepNumber === 1) {
      const detaineeInfo = caseData.detaineeInfo;
      const isValid = (
        detaineeInfo.fullName.trim() !== '' &&
        detaineeInfo.idNumber.trim() !== '' &&
        detaineeInfo.dateOfBirth.trim() !== '' &&
        detaineeInfo.healthStatus.trim() !== '' &&
        detaineeInfo.maritalStatus.trim() !== '' &&
        detaineeInfo.city.trim() !== '' &&
        detaineeInfo.governorate.trim() !== '' &&
        detaineeInfo.district.trim() !== ''
      );
      console.log('Step 1 validation:', { detaineeInfo, isValid });
      return isValid;
    }
    
    // For step 2, check if all required fields are filled
    if (stepNumber === 2) {
      const detentionInfo = caseData.detentionInfo;
      const isValid = (
        detentionInfo.disappearanceDate.trim() !== '' &&
        detentionInfo.city.trim() !== '' &&
        detentionInfo.governorate.trim() !== '' &&
        detentionInfo.district.trim() !== ''
      );
      console.log('Step 2 validation:', { detentionInfo, isValid });
      return isValid;
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

  const getStepStatus = (stepNumber: number) => {
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
              <h1 className="new-case__title">
                {locale === "ar"
                  ? "منصة تقرير الاختفاء"
                  : "Disappearance Report Platform"}
              </h1>
              <p className="new-case__description">
                {locale === "ar"
                  ? "نص تجريبي بسيط لصناعة الطباعة والتنضيد."
                  : "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry."}
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
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
