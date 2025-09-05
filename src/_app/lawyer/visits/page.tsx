"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "../components/LawyerHeader";
import CustomSelect from "../../components/CustomSelect";
import "@/app/css/lawyer.css";
import LawyerProtectedLayout from "../../components/LawyerProtectedLayout";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  IconRefresh,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconLoader,
  IconCheck,
  IconX,
  IconDots,
  IconFileText,
} from "@tabler/icons-react";
import { getLawyerVisits, approveVisit, rejectVisit, completeVisit } from "../../services/api";
import { LawyerAuth } from "../../utils/auth";
import React from "react";
import toast from "react-hot-toast";
import VisitApproveModal from "../../components/modals/VisitApproveModal";
import VisitOutcomeModal from "../../components/modals/VisitOutcomeModal";
import VisitRejectionModal from "../../components/modals/VisitRejectionModal";
import { formatDateWithLocale } from "../../utils/dateUtils";
import { getVisitStatusTranslation } from "../../utils/statusTranslation";

interface Visit {
  id: string;
  title: string;
  case_id: string;
  case_number: string;
  detainee_name: string;
  visit_date: string;
  visit_time: string | null;
  visit_type: string;
  status: string;
  status_display: string;
  is_urgent: boolean;
  prison_name: string;
  prison_id: string;
  duration_minutes: number | null;
  notes: string;
  created: string;
  updated: string;
}

interface PaginationInfo {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}



function LawyerVisitsInner() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  // State
  const [visits, setVisits] = useState<Visit[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [daysFilter, setDaysFilter] = useState(7); // Default to 7 days
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isFilterParamsReady, setIsFilterParamsReady] = useState(false);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

  const statusOptions = [
    { value: "todo", label: t("lawyer.visits.statusOptions.todo") },
    {
      value: "in_progress",
      label: t("lawyer.visits.statusOptions.in_progress"),
    },
    { value: "completed", label: t("lawyer.visits.statusOptions.completed") },
    { value: "cancelled", label: t("lawyer.visits.statusOptions.cancelled") },
    { value: "done", label: t("lawyer.visits.statusOptions.done") },
    { value: "rejected", label: t("lawyer.visits.statusOptions.rejected") },
  ];

  const daysOptions = [
    { value: 1, label: t("lawyer.visits.filters.daysFilter.today") },
    { value: 7, label: t("lawyer.visits.filters.daysFilter.thisWeek") },
    { value: 30, label: t("lawyer.visits.filters.daysFilter.thisMonth") },
    { value: 90, label: t("lawyer.visits.filters.daysFilter.next3Months") },
  ];

  // Fetch visits from API
  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await getLawyerVisits(
        token,
        {
          days: daysFilter,
          status: statusFilter && statusFilter.trim() !== "" ? statusFilter : undefined,
          page: currentPage,
          page_size: pageSize,
          urgent_only: urgentOnly,
        },
        locale
      );

      if (response.status === "success" && response.data) {
        setVisits(response.data.visits || []);
        setPagination(response.data.pagination || null);

      } else {
        throw new Error(response.message || t("messages.errors.failedToFetchVisits"));
      }
    } catch (err: any) {
      console.error("Error fetching visits:", err);
              setError(err.message || t("messages.errors.failedToFetchVisits"));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, urgentOnly, daysFilter, currentPage, pageSize, locale, t]);

  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get("status") || "";
    const urgent = searchParams.get("urgent_only") === "true";
    const days = parseInt(searchParams.get("days") || "7");
    const page = parseInt(searchParams.get("page") || "1");

    setStatusFilter(status);
    setUrgentOnly(urgent);
    setDaysFilter(days);
    setCurrentPage(page);

    setIsFilterParamsReady(true);
  }, [searchParams]);

  // Fetch visits when params are ready
  useEffect(() => {
    if (isFilterParamsReady) {
      fetchVisits();
    }
  }, [isFilterParamsReady, fetchVisits]);

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    if (!isFilterParamsReady || loading) return;
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleUrgentChange = (value: boolean) => {
    if (!isFilterParamsReady || loading) return;
    setUrgentOnly(value);
    setCurrentPage(1);
  };

  const handleDaysChange = (value: number) => {
    if (!isFilterParamsReady || loading) return;
    setDaysFilter(value);
    setCurrentPage(1);
  };

  const handleApprove = (visitId: string) => {
    setSelectedVisitId(visitId);
    setShowApproveModal(true);
    setOpenDropdown(null);
  };

  const handleReject = (visitId: string) => {
    setSelectedVisitId(visitId);
    setShowRejectionModal(true);
    setOpenDropdown(null);
  };

  const handleOutcome = (visitId: string) => {
    setSelectedVisitId(visitId);
    setShowOutcomeModal(true);
    setOpenDropdown(null);
  };

  const handleApproveSubmit = async (notes: string) => {
    try {
      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("No authentication token");
      }
      
      if (!selectedVisitId) {
        throw new Error("No visit selected");
      }

      const response = await approveVisit(token, selectedVisitId, notes, locale);
      
      if (response.status === "success") {
        // Refresh visits after successful submission
        fetchVisits();
        setShowApproveModal(false);
      } else {
        throw new Error(response.message || t("messages.errors.failedToApproveVisit"));
      }
    } catch (error: any) {
      console.error('Error approving visit:', error);
      
      // Extract error message from API response
              let errorMessage = t("messages.errors.failedToApproveVisit");
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error(errorMessage);
    }
  };

  const handleRejectionSubmit = async (reason: string) => {
    try {
      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("No authentication token");
      }
      
      if (!selectedVisitId) {
        throw new Error("No visit selected");
      }

      const response = await rejectVisit(token, selectedVisitId, reason, locale);
      
      if (response.status === "success") {
        // Refresh visits after successful submission
        fetchVisits();
        setShowRejectionModal(false);
      } else {
        throw new Error(response.message || t("messages.errors.failedToRejectVisit"));
      }
    } catch (error: any) {
      console.error('Error rejecting visit:', error);
      
      // Extract error message from API response
              let errorMessage = t("messages.errors.failedToRejectVisit");
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error(errorMessage);
    }
  };

  const handleOutcomeSubmit = async (outcome: string) => {
    try {
      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("No authentication token");
      }
      
      if (!selectedVisitId) {
        throw new Error("No visit selected");
      }

      const response = await completeVisit(token, selectedVisitId, outcome, locale);
      
      if (response.status === "success") {
        // Refresh visits after successful submission
        fetchVisits();
        setShowOutcomeModal(false);
      } else {
        throw new Error(response.message || t("messages.errors.failedToCompleteVisit"));
      }
    } catch (error: any) {
      console.error('Error completing visit:', error);
      
      // Extract error message from API response
              let errorMessage = t("messages.errors.failedToCompleteVisit");
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error(errorMessage);
    }
  };

  const toggleDropdown = (visitId: string) => {
    setOpenDropdown(openDropdown === visitId ? null : visitId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.lawyer__dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);

  const handlePageChange = (page: number) => {
    if (!isFilterParamsReady || loading) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    if (!isFilterParamsReady || loading) return;
    setCurrentPage(1);
    setExpandedRows(new Set());
    fetchVisits();
  };

  const toggleRowExpansion = (visitId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(visitId)) {
      newExpandedRows.delete(visitId);
    } else {
      newExpandedRows.add(visitId);
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (visitId: string) => expandedRows.has(visitId);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "lawyer__status--pending";
      case "in_progress":
        return "lawyer__status--progress";
      case "completed":
        return "lawyer__status--completed";
      case "done":
        return "lawyer__status--done";
      case "rejected":
        return "lawyer__status--rejected";
      case "cancelled":
        return "lawyer__status--cancelled";
      default:
        return "lawyer__status--default";
    }
  };



  const formatTime = (timeString: string | null) => {
    if (!timeString) return "—";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      "ar-SA",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  return (
    <div className="lawyer">
      <div className="lawyer__container">
        {/* Header */}
        <LawyerHeader activeTab="visits" />

        {/* Visits Content */}
        <main className="lawyer__cases">
          <div className="lawyer__cases-header">
            <h1 className="lawyer__cases-title">{t("lawyer.visits.title")}</h1>
            <button className="lawyer__refresh" onClick={handleRefresh}>
              <IconRefresh size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="lawyer__cases-filters">
            <div className="lawyer__filter">
              <CustomSelect
                value={String(daysFilter)}
                onChange={(value) => handleDaysChange(Number(value))}
                placeholder={
                  t("lawyer.visits.filters.daysFilter.label")?.toString() ||
                  "Time Period"
                }
                options={daysOptions.map((option) => ({
                  value: String(option.value),
                  label: option.label,
                }))}
                includeNullOption={false}
                isSearchable={false}
                instanceId="visits-days-filter"
              />
            </div>

            <div className="lawyer__filter">
              <CustomSelect
                value={statusFilter}
                onChange={handleStatusChange}
                placeholder={
                  t("lawyer.visits.filters.allStatuses")?.toString() ||
                  "All Statuses"
                }
                options={statusOptions}
                includeNullOption={true}
                isSearchable={false}
                instanceId="visits-status-filter"
              />
            </div>

            <div className="lawyer__filter">
              <CustomSelect
                value={urgentOnly ? t("common.urgentCases") : t("common.allCases")}
                onChange={(value) => handleUrgentChange(value === t("common.urgentCases"))}
                placeholder={t("lawyer.visits.filters.allVisits")}
                options={[
                  { value: '', label: t("lawyer.visits.filters.allVisits") },
                  {
                    value: t("common.urgentCases"),
                    label: t("lawyer.visits.filters.urgentOnly"),
                  },
                ]}
                includeNullOption={false}
                isSearchable={false}
                instanceId="visits-urgent-filter"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="lawyer__error">
              {error}
              <button onClick={fetchVisits} className="lawyer__retry-button">
                Retry
              </button>
            </div>
          )}

          {/* Visits Table */}
          <div className="lawyer__table-wrapper">
            <table className="lawyer__table">
              <thead className="lawyer__table-header">
                <tr>
                  <th className="lawyer__table-expand-header"></th>
                  <th>{t("lawyer.visits.table.visitDate")}</th>
                  <th>{t("lawyer.visits.table.detaineeName")}</th>
                  <th>{t("lawyer.visits.table.prisonName")}</th>
                  <th style={{ width: "180px" }}>{t("lawyer.visits.table.visitType")}</th>
                  <th style={{ width: "80px" }}>{t("lawyer.visits.table.status")}</th>
                  <th style={{ width: "80px" }}>
                    {t("lawyer.visits.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="lawyer__table-body">
                {loading && (
                  <tr className="lawyer__table-loading-row">
                    <td colSpan={7} className="lawyer__table-loading-cell">
                      <div className="lawyer__table-loading-content">
                        <IconLoader
                          size={24}
                          className="lawyer__loading-spinner"
                        />
                        <span>Loading visits...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && visits.length === 0 && (
                  <tr className="lawyer__table-empty-row">
                    <td colSpan={7} className="lawyer__table-empty-cell">
                      <div className="lawyer__table-empty-content">
                        <span>No visits found</span>
                        {error && (
                          <button
                            onClick={fetchVisits}
                            className="lawyer__retry-button"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading &&
                  visits.length > 0 &&
                  visits.map((visit) => (
                    <React.Fragment key={visit.id}>
                      <tr className="lawyer__table-row">
                        <td className="lawyer__table-cell lawyer__table-expand-cell" data-label="">
                          <button
                            className="lawyer__expand-button"
                            onClick={() => toggleRowExpansion(visit.id)}
                            aria-label={
                              isRowExpanded(visit.id)
                                ? "Collapse row"
                                : "Expand row"
                            }
                          >
                            {isRowExpanded(visit.id) ? (
                              <IconChevronDown size={20} />
                            ) : (
                              <IconChevronRight size={20} />
                            )}
                          </button>
                        </td>
                        <td className="lawyer__table-cell" data-label="Visit Date">
                          <div className="lawyer__visit-date-wrapper">
                            <span className="lawyer__visit-date">
                              {formatDateWithLocale(visit.visit_date)}
                            </span>
                            {visit.visit_time && (
                              <span className="lawyer__visit-time">
                                {formatTime(visit.visit_time)}
                              </span>
                            )}
                            {visit.is_urgent && (
                              <span className="lawyer__case-urgent-badge">
                                <IconAlertCircle size={16} stroke={1.5} />
                                {t("lawyer.dashboard.stats.urgent")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="lawyer__table-cell" data-label="Detainee">
                          <span className="lawyer__detainee-name">
                            {visit.detainee_name}
                          </span>
                        </td>
                        <td className="lawyer__table-cell" data-label="Prison">
                          <span className="lawyer__prison-name">
                            {visit.prison_name}
                          </span>
                        </td>
                        <td className="lawyer__table-cell" data-label="Type">
                          <span className="lawyer__visit-type">
                            {t(
                              `lawyer.visits.visitTypes.${visit.visit_type}` as any
                            ) || visit.visit_type}
                          </span>
                        </td>
                        <td className="lawyer__table-cell" data-label="Status">
                          <span
                            className={`lawyer__status ${getStatusClass(
                              visit.status
                            )}`}
                          >
                            {getVisitStatusTranslation(visit.status, t)}
                          </span>
                        </td>
                        <td className="lawyer__table-cell" data-label="Actions">
                          <div className="lawyer__visit-actions">
                            {visit.status !== "done" && (
                              <div className="lawyer__dropdown-container">
                                <button
                                  className="lawyer__dropdown-trigger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDropdown(visit.id);
                                  }}
                                >
                                  <IconDots size={20} />
                                </button>

                                {openDropdown === visit.id && (
                                  <div 
                                    data-dropdown={visit.id}
                                    className="lawyer__dropdown-menu"
                                  >
                                    {visit.status === "todo" && (
                                      <>
                                        <button
                                          className="lawyer__dropdown-item"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApprove(visit.id);
                                          }}
                                        >
                                          <IconCheck size={16} />
                                          {t("lawyer.visits.actions.approve")}
                                        </button>
                                        <button
                                          className="lawyer__dropdown-item"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleReject(visit.id);
                                          }}
                                        >
                                          <IconX size={16} />
                                          {t("lawyer.visits.actions.reject")}
                                        </button>
                                      </>
                                    )}
                                    {visit.status === "in_progress" && (
                                      <button
                                        className="lawyer__dropdown-item"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOutcome(visit.id);
                                        }}
                                      >
                                        <IconFileText size={16} />
                                        {t("lawyer.visits.actions.outcome")}
                                      </button>
                                    )}
                                    {visit.status === "rejected" && (
                                      <div className="lawyer__dropdown-item lawyer__dropdown-item--disabled">
                                        {t("lawyer.visits.actions.rejected")}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isRowExpanded(visit.id) && (
                        <tr className="lawyer__table-expanded-row">
                          <td
                            colSpan={7}
                            className="lawyer__table-expanded-cell"
                          >
                            <div className="lawyer__expanded-content">
                              <div className="lawyer__expanded-section">
                                <div className="lawyer__expanded-grid">
                                  <div className="lawyer__expanded-item">
                                    <span className="lawyer__expanded-label">
                                      {t("lawyer.visits.expanded.caseNumber")}:
                                    </span>
                                    <Link
                                      href={`/${locale}/lawyer/cases/${visit.case_id}`}
                                      className="lawyer__case-id-link"
                                    >
                                      {visit.case_number}
                                    </Link>
                                  </div>
                                  <div className="lawyer__expanded-item">
                                    <span className="lawyer__expanded-label">
                                      {t("lawyer.visits.expanded.detainee")}:
                                    </span>
                                    <span className="lawyer__expanded-value">
                                      {visit.detainee_name}
                                    </span>
                                  </div>
                                  <div className="lawyer__expanded-item">
                                    <span className="lawyer__expanded-label">
                                      {t("lawyer.visits.expanded.prison")}:
                                    </span>
                                    <span className="lawyer__expanded-value">
                                      {visit.prison_name}
                                    </span>
                                  </div>
                                  <div className="lawyer__expanded-item">
                                    <span className="lawyer__expanded-label">
                                      {t("lawyer.visits.expanded.visitType")}:
                                    </span>
                                    <span className="lawyer__expanded-value">
                                      {t(
                                        `lawyer.visits.visitTypes.${visit.visit_type}` as any
                                      ) || visit.visit_type}
                                    </span>
                                  </div>
                                  <div className="lawyer__expanded-item">
                                    <span className="lawyer__expanded-label">
                                      {t("lawyer.visits.expanded.urgent")}:
                                    </span>
                                    <span className="lawyer__expanded-value">
                                      {visit.is_urgent ? "Yes" : "No"}
                                    </span>
                                  </div>
                                  {visit.notes && (
                                    <div className="lawyer__expanded-item lawyer__expanded-item--full">
                                      <span className="lawyer__expanded-label">
                                        {t("lawyer.visits.expanded.notes")}:
                                      </span>
                                      <span className="lawyer__expanded-value">
                                        {visit.notes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="lawyer__pagination">
              <button
                className="lawyer__pagination-button"
                disabled={!pagination.has_previous}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                {t("lawyer.visits.pagination.previous")}
              </button>

              <div className="lawyer__pagination-info">
                {t("lawyer.visits.pagination.showing", {
                  start: String(
                    (pagination.current_page - 1) * pagination.page_size + 1
                  ),
                  end: String(
                    Math.min(
                      pagination.current_page * pagination.page_size,
                      pagination.total_items
                    )
                  ),
                  total: String(pagination.total_items),
                })}
              </div>

              <button
                className="lawyer__pagination-button"
                disabled={!pagination.has_next}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                {t("lawyer.visits.pagination.next")}
              </button>
            </div>
          )}

          {/* Modals */}
          <VisitApproveModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            onSubmit={handleApproveSubmit}
            visitId={selectedVisitId || undefined}
          />
          
          <VisitOutcomeModal
            isOpen={showOutcomeModal}
            onClose={() => setShowOutcomeModal(false)}
            onSubmit={handleOutcomeSubmit}
            visitId={selectedVisitId || undefined}
          />
          
          <VisitRejectionModal
            isOpen={showRejectionModal}
            onClose={() => setShowRejectionModal(false)}
            onSubmit={handleRejectionSubmit}
            visitId={selectedVisitId || undefined}
          />
        </main>
      </div>
    </div>
  );
}

export default function LawyerAllVisitsPage() {
  return (
    <LawyerProtectedLayout>
      <LawyerVisitsInner />
    </LawyerProtectedLayout>
  );
}
