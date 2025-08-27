"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomSelect from "../CustomSelect";
import { IconX } from "@tabler/icons-react";
import { getVisitFormOptions } from "@/_app/services/api";
import { LawyerAuth } from "@/_app/utils/auth";

interface RequestVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestVisitData) => void;
}

interface RequestVisitData {
  title: string;
  prison_id: string;
  visit_type: string; // backend expects a string value key
  visitDate: Date | null;
}

export default function RequestVisitModal({ isOpen, onClose, onSubmit }: RequestVisitModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prisons, setPrisons] = useState<any[]>([]);
  const [visitTypes, setVisitTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState<RequestVisitData>({
    title: "",
    prison_id: "",
    visit_type: "",
    visitDate: null,
  });

  // Load form options when modal opens
  useEffect(() => {
    const loadOptions = async () => {
      if (!isOpen) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = LawyerAuth.getAccessToken();
        if (!token) throw new Error("NOT_AUTHENTICATED");
        const res = await getVisitFormOptions(token, locale);
        const data = res?.data ?? {};
        setPrisons(Array.isArray(data.prisons) ? data.prisons : []);
        setVisitTypes(Array.isArray(data.visit_types) ? data.visit_types : []);
      } catch (e: any) {
        setError("Failed to load visit options");
        console.error("Failed to load visit form options", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, [isOpen, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.prison_id && formData.visit_type && formData.visitDate) {
      const payload = {
        title: formData.title,
        prison_id: formData.prison_id,
        visit_type: formData.visit_type,
        visit_date: formData.visitDate.toISOString().split("T")[0],
      };
      onSubmit(payload as any);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", prison_id: "", visit_type: "", visitDate: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("lawyer.modals.requestVisit.title")}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.requestVisit.titleField")}
            </label>
            <input
              type="text"
              className="modal-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("lawyer.modals.requestVisit.titlePlaceholder")?.toString()}
              required
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.requestVisit.prisonName")}*
            </label>
            <CustomSelect
              value={formData.prison_id}
              onChange={(value) => setFormData({ ...formData, prison_id: value })}
              placeholder={t("lawyer.modals.requestVisit.choosePrison")?.toString() || "Choose"}
              options={prisons}
              labelKey="name"
              valueKey="id"
              includeNullOption={false}
              isSearchable={true}
              instanceId="request-visit-prison-select"
              fullWidth
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.visits.table.visitType")}*
            </label>
            <CustomSelect
              value={formData.visit_type}
              onChange={(value) => setFormData({ ...formData, visit_type: value })}
              placeholder={`${t("newCase.common.choose")} ${t("lawyer.visits.table.visitType")}`}
              options={visitTypes}
              labelKey="name"
              valueKey="value"
              includeNullOption={false}
              isSearchable={true}
              instanceId="request-visit-type-select"
              fullWidth
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.requestVisit.visitDate")}
            </label>
            <div className="modal-date-picker-wrapper">
              <DatePicker
                selected={formData.visitDate}
                onChange={(date) => setFormData({ ...formData, visitDate: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText={t("lawyer.modals.requestVisit.chooseDate")?.toString() || "Choose Date"}
                className="modal-date-input"
                minDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
                required
              />
            </div>
          </div>

          {error && (
            <div className="modal-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="modal-submit-btn">
            {isLoading ? t("newCase.common.loading") : t("lawyer.modals.requestVisit.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
