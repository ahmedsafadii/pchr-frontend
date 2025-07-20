'use client';

import { CaseData } from '../page';

interface Step5Props {
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

export default function Step5({
  onComplete,
  onNext,
  onPrevious,
  currentStep,
}: Step5Props) {
  const handleNext = () => {
    onComplete(currentStep);
    onNext();
  };

  return (
    <div className="step5">
      <header className="step5__header">
        <span className="step5__step-number">STEP 5</span>
        <h2 className="step5__title">Delegation & Communication</h2>
      </header>

      <div className="step5__content">
        <p>Step 5: Understand Any Prior Efforts Made And Contact Preferences.</p>
        <p>This step will contain form fields for:</p>
        <ul>
          <li>Prior Efforts Made</li>
          <li>Contact Preferences</li>
          <li>Preferred Language</li>
          <li>Emergency Contact</li>
          <li>Additional Notes</li>
        </ul>
      </div>

      <div className="step5__navigation">
        <button
          type="button"
          className="step5__button step5__button--previous"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          type="button"
          className="step5__button step5__button--next"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
} 