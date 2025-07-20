'use client';

import { CaseData } from '../page';

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
}

export default function Step6({
  onComplete,
  onPrevious,
  currentStep,
}: Step6Props) {
  const handleSubmit = () => {
    onComplete(currentStep);
    // Here you would typically submit the case data to the server
    console.log('Case submitted successfully!');
  };

  return (
    <div className="step6">
      <header className="step6__header">
        <span className="step6__step-number">STEP 6</span>
        <h2 className="step6__title">Consent and Submission</h2>
      </header>

      <div className="step6__content">
        <p>Step 6: Obtain Legal Authorization.</p>
        <p>This step will contain:</p>
        <ul>
          <li>Terms and Conditions Acceptance</li>
          <li>Privacy Policy Acceptance</li>
          <li>Data Processing Consent</li>
          <li>Final Review of All Information</li>
          <li>Submit Case Button</li>
        </ul>
      </div>

      <div className="step6__navigation">
        <button
          type="button"
          className="step6__button step6__button--previous"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          type="button"
          className="step6__button step6__button--submit"
          onClick={handleSubmit}
        >
          Submit Case
        </button>
      </div>
    </div>
  );
} 