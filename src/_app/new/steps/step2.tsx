'use client';

import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { CaseData } from '../page';

interface Step2Props {
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

export default function Step2({
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  locale = 'en',
}: Step2Props) {
  const handleNext = () => {
    onComplete(currentStep);
    onNext();
  };

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 2</span>
        <h2 className="steps__title">
          {locale === 'ar' ? 'معلومات الاعتقال/الاختفاء' : 'Detention/Disappearance Info'}
        </h2>
      </header>

      <div className="steps__content">
        <p>{locale === 'ar' ? 'الخطوة 2: تسجيل أين ومتى وكيف اختفى الشخص.' : 'Step 2: Record Where, When, And How The Person Went Missing.'}</p>
        <p>{locale === 'ar' ? 'ستحتوي هذه الخطوة على حقول النموذج لـ:' : 'This step will contain form fields for:'}</p>
        <ul>
          <li>{locale === 'ar' ? 'تاريخ الاختفاء' : 'Disappearance Date'}</li>
          <li>{locale === 'ar' ? 'موقع الاختفاء' : 'Disappearance Location'}</li>
          <li>{locale === 'ar' ? 'الظروف' : 'Circumstances'}</li>
          <li>{locale === 'ar' ? 'آخر مرة شوهد' : 'Last Seen'}</li>
          <li>{locale === 'ar' ? 'الشهود' : 'Witnesses'}</li>
          <li>{locale === 'ar' ? 'السلطات التي تم الاتصال بها' : 'Authorities Contacted'}</li>
        </ul>
      </div>

      <div className="steps__navigation">
        <button
          type="button"
          className="steps__button steps__button--previous"
          onClick={onPrevious}
        >
          <IconArrowLeft size={16} />
          <span>{locale === 'ar' ? 'السابق' : 'Previous'}</span>
        </button>
        <button
          type="button"
          className="steps__button steps__button--next"
          onClick={handleNext}
        >
          <span>{locale === 'ar' ? 'التالي' : 'Next'}</span>
          <IconArrowRight size={16} />
        </button>
      </div>
    </div>
  );
} 