"use client";

import { useState } from "react";
import { useTranslations } from "next-globe-gen";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomSelect from "../CustomSelect";
import { IconX } from "@tabler/icons-react";

interface RequestVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestVisitData) => void;
}

interface RequestVisitData {
  title: string;
  prisonName: string;
  visitDate: Date | null;
}

// Mock prison data - replace with real API data
const mockPrisons = [
  { id: "1", name: "Central Prison Gaza" },
  { id: "2", name: "Ofer Military Prison" },
  { id: "3", name: "Megiddo Prison" },
  { id: "4", name: "Gilboa Prison" },
  { id: "5", name: "Ramon Prison" },
  { id: "6", name: "Ashkelon Prison" },
  { id: "7", name: "Hadarim Prison" },
  { id: "8", name: "Nafha Prison" },
];

export default function RequestVisitModal({ isOpen, onClose, onSubmit }: RequestVisitModalProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<RequestVisitData>({
    title: "",
    prisonName: "",
    visitDate: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.prisonName && formData.visitDate) {
      onSubmit(formData);
      setFormData({ title: "", prisonName: "", visitDate: null });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ title: "", prisonName: "", visitDate: null });
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
              value={formData.prisonName}
              onChange={(value) => setFormData({ ...formData, prisonName: value })}
              placeholder={t("lawyer.modals.requestVisit.choosePrison")?.toString() || "Choose Type"}
              options={mockPrisons}
              labelKey="name"
              valueKey="id"
              includeNullOption={false}
              isSearchable={true}
              instanceId="request-visit-prison-select"
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

          <button type="submit" className="modal-submit-btn">
            {t("lawyer.modals.requestVisit.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
