'use client';

import { CaseData } from '../page';

interface Step4Props {
  data: CaseData;
  updateData: (section: keyof CaseData, data: any) => void;
  onComplete: (stepNumber: number) => void;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  currentStep: number;
  totalSteps: number;
}

export default function Step4({
  onComplete,
  onNext,
  onPrevious,
  currentStep,
}: Step4Props) {
  const handleNext = () => {
    onComplete(currentStep);
    onNext();
  };

  return (
    <div className="step4">
      <header className="step4__header">
        <span className="step4__step-number">STEP 4</span>
        <h2 className="step4__title">Documents Upload</h2>
      </header>

      <div className="step4__content">
        <p>Step 4: Ensure Identity Validation And Legal Handling.</p>
        <p>This step will contain file upload fields for:</p>
        <ul>
          <li>ID Card</li>
          <li>Photos of Missing Person</li>
          <li>Other Supporting Documents</li>
        </ul>
      </div>

      <div className="step4__navigation">
        <button
          type="button"
          className="step4__button step4__button--previous"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          type="button"
          className="step4__button step4__button--next"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
} 