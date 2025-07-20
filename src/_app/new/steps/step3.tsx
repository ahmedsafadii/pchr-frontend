'use client';

import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { CaseData } from '../page';

interface Step3Props {
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

export default function Step3({
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  locale = 'en',
}: Step3Props) {
  const handleNext = () => {
    onComplete(currentStep);
    onNext();
  };

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 3</span>
        <h2 className="steps__title">
          {locale === 'ar' ? 'معلومات العميل' : 'Client Info'}
        </h2>
      </header>

      <div className="steps__content">
        <p>{locale === 'ar' ? 'الخطوة 3: التقاط من يبلغ عن القضية.' : 'Step 3: Capture Who Is Reporting The Case.'}</p>
        <p>{locale === 'ar' ? 'ستحتوي هذه الخطوة على حقول النموذج لـ:' : 'This step will contain form fields for:'}</p>
        <ul>
          <li>{locale === 'ar' ? 'الاسم الكامل للعميل' : 'Client Full Name'}</li>
          <li>{locale === 'ar' ? 'العلاقة بالشخص المفقود' : 'Relationship to Missing Person'}</li>
          <li>{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</li>
          <li>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</li>
          <li>{locale === 'ar' ? 'العنوان' : 'Address'}</li>
          <li>{locale === 'ar' ? 'رقم الهوية' : 'ID Number'}</li>
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