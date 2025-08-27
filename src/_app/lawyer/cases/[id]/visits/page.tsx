"use client";

import { useTranslations } from "next-globe-gen";
import CustomSelect from "../../../../components/CustomSelect";
import "@/app/css/lawyer.css";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconCheck,
  IconX,
  IconDots,
  IconFileText,
} from "@tabler/icons-react";
import { getLawyerVisits, requestCaseVisit } from "../../../../utils/apiWithAuth";
import { useLawyerAuth } from "../../../../hooks/useLawyerAuth";
import { useLocale } from "next-globe-gen";
import toast from "react-hot-toast";
import RequestVisitModal from "../../../../components/modals/RequestVisitModal";
import VisitOutcomeModal from "../../../../components/modals/VisitOutcomeModal";
import VisitRejectionModal from "../../../../components/modals/VisitRejectionModal";
import React from "react";

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

function LawyerCaseVisitsInner() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useLawyerAuth();
  const caseId = params.id as string;

  // State
  const [visits, setVisits] = useState<Visit[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [daysFilter, setDaysFilter] = useState(7); // Default to 7 days

  // Filter options
  const statusOptions = [
    { value: "todo", label: t("lawyer.visits.statusOptions.todo") },
    {
      value: "in_progress",
      label: t("lawyer.visits.statusOptions.in_progress"),
    },
    { value: "completed", label: t("lawyer.visits.statusOptions.completed") },
    { value: "cancelled", label: t("lawyer.visits.statusOptions.cancelled") },
  ];

  const daysOptions = [
    { value: 1, label: t("lawyer.visits.filters.daysFilter.today") },
    { value: 7, label: t("lawyer.visits.filters.daysFilter.thisWeek") },
    { value: 30, label: t("lawyer.visits.filters.daysFilter.thisMonth") },
    { value: 90, label: t("lawyer.visits.filters.daysFilter.next3Months") },
  ];

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isFilterParamsReady, setIsFilterParamsReady] = useState(false);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Modal states
  const [showRequestVisitModal, setShowRequestVisitModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);



  // Fetch visits from API
  const fetchVisits = useCallback(async () => {
    if (!caseId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: currentPage,
        page_size: pageSize,
        days: daysFilter,
        status: statusFilter || undefined
      };

      console.log('Fetching visits with params:', params);
      const response = await getLawyerVisits('en', caseId, params);

      if (response.status === "success" && response.data) {
        setVisits(response.data.visits || []);
        setPagination(response.data.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch visits");
      }
    } catch (err: any) {
      console.error("Error fetching visits:", err);
      setError(err.message || "Failed to fetch visits");
    } finally {
      setLoading(false);
    }
  }, [caseId, currentPage, pageSize, daysFilter, statusFilter]);

  // Initialize page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
    setIsFilterParamsReady(true);
  }, [searchParams]);

  // Filter change handlers
  const handleStatusChange = (value: string) => {
    if (!isFilterParamsReady) return;
    console.log('Status filter changed to:', value);
    console.log('Previous statusFilter was:', statusFilter);
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDaysChange = (value: number) => {
    if (!isFilterParamsReady) return;
    console.log('Days filter changed to:', value);
    console.log('Previous daysFilter was:', daysFilter);
    setDaysFilter(value);
    setCurrentPage(1);
  };

  // Fetch visits when params are ready
  useEffect(() => {
    if (isFilterParamsReady && isAuthenticated && caseId) {
      fetchVisits();
    }
  }, [isFilterParamsReady, isAuthenticated, caseId, daysFilter, statusFilter, fetchVisits]);

  // Debug: Log filter state changes
  useEffect(() => {
    console.log('Filter states updated:', { daysFilter, statusFilter });
  }, [daysFilter, statusFilter]);


  const handleApprove = (visitId: string) => {
    // Handle approve action - replace with actual API call
    console.log(`Approving visit ${visitId}`);
    setOpenDropdown(null);
    // In real app, make API call to approve visit
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

  const handleStartVisit = () => {
    setShowRequestVisitModal(true);
  };

  const handleRequestVisitSubmit = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        prison_id: data.prison_id,
        visit_date: data.visit_date,
        visit_type: data.visit_type,
      };
      const res = await requestCaseVisit(caseId, payload, locale);
      if (res.status === "success") {
        toast.success(t("newCase.submitModals.success.title").toString());
        setShowRequestVisitModal(false);
        await fetchVisits();
      } else {
        toast.error(res.message || t("lawyerProfile.errors.general").toString());
      }
    } catch (error: any) {
      console.error('Visit request error:', error);
      const apiMessage = error.payload?.error?.message || error.message || t("lawyerProfile.errors.general").toString();
      toast.error(apiMessage);
    }
  };

  const handleOutcomeSubmit = (outcome: string) => {
    // Handle outcome submission - replace with actual API call
    console.log(`Visit ${selectedVisitId} outcome:`, outcome);
    setShowOutcomeModal(false);
    // Refresh visits after successful submission
    fetchVisits();
  };

  const handleRejectionSubmit = (reason: string) => {
    // Handle rejection submission - replace with actual API call
    console.log(`Visit ${selectedVisitId} rejection reason:`, reason);
    setShowRejectionModal(false);
    // Refresh visits after successful submission
    fetchVisits();
  };

  const toggleDropdown = (visitId: string) => {
    setOpenDropdown(openDropdown === visitId ? null : visitId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
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
        return "case__status--pending";
      case "in_progress":
        return "case__status--progress";
      case "completed":
        return "case__status--completed";
      case "cancelled":
        return "case__status--cancelled";
      default:
        return "case__status--default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "—";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="lawyer__loading">
        <div className="lawyer__loading-spinner"></div>
        <p>{(t as any)("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lawyer__error">
        <IconAlertCircle size={48} className="lawyer__error-icon" />
        <h2>{(t as any)("common.error")}</h2>
        <p>{error}</p>
        <button onClick={fetchVisits} className="lawyer__btn lawyer__btn--primary">
          {(t as any)("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="lawyer__visits-header">
        <h1 className="lawyer__visits-title">{t("lawyer.visits.title")}</h1>
        <div className="lawyer__visits-header-actions">
          <button className="lawyer__start-visit-btn" onClick={handleStartVisit}>
            {t("lawyer.visits.startVisit")}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="lawyer__cases-filters">
        <div className="lawyer__filter">
          <CustomSelect
            value={daysFilter.toString()}
            onChange={(value) => handleDaysChange(Number(value))}
            placeholder={
              t("lawyer.visits.filters.daysFilter.label")?.toString() ||
              "Time Period"
            }
            options={daysOptions.map((option) => ({
              value: option.value.toString(),
              label: option.label,
            }))}
            includeNullOption={false}
            isSearchable={false}
            instanceId="case-visits-days-filter"
          />
        </div>

        <div className="lawyer__filter">
          <CustomSelect
            value={statusFilter || ""}
            onChange={handleStatusChange}
            placeholder={
              t("lawyer.visits.filters.allStatuses")?.toString() ||
              "All Statuses"
            }
            options={statusOptions}
            includeNullOption={true}
            isSearchable={false}
            instanceId="case-visits-status-filter"
          />
        </div>
      </div>


      {/* Visits Table */}
      <div className="lawyer__table-wrapper">
        <table className="lawyer__table">
                     <thead className="lawyer__table-header">
             <tr>
               <th style={{ width: "50px" }}></th>
               <th>{t("lawyer.visits.table.visitDate")}</th>
               <th>{t("lawyer.visits.table.prisonName")}</th>
               <th>{t("lawyer.visits.table.visitType")}</th>
               <th>{t("lawyer.visits.table.status")}</th>
               <th style={{ width: "100px" }}>
                 {t("lawyer.visits.table.actions")}
               </th>
             </tr>
           </thead>
          <tbody className="lawyer__table-body">
                         {visits.map((visit) => (
               <React.Fragment key={visit.id}>
                 <tr className="lawyer__table-row">
                   <td className="lawyer__table-cell">
                     <button
                       className="lawyer__expand-button"
                       onClick={() => toggleRowExpansion(visit.id)}
                       aria-label={isRowExpanded(visit.id) ? "Collapse row" : "Expand row"}
                     >
                       {isRowExpanded(visit.id) ? (
                         <IconChevronDown size={16} />
                       ) : (
                         <IconChevronRight size={16} />
                       )}
                     </button>
                   </td>
                                      <td className="lawyer__table-cell">
                     <div className="lawyer__visit-date-time">
                       <span className="lawyer__visit-date">
                         {formatDate(visit.visit_date)}
                       </span>
                       {visit.visit_time && (
                         <span className="lawyer__visit-time">
                           {formatTime(visit.visit_time)}
                         </span>
                       )}
                     </div>
                   </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__prison-name">
                      {visit.prison_name}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__visit-type">
                      {(t as any)(`lawyer.visits.visitTypes.${visit.visit_type}`) || visit.visit_type}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className={`lawyer__status ${getStatusClass(visit.status)}`}>
                      {visit.status_display}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <div className="lawyer__visit-actions">
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
                          <div className="lawyer__dropdown-menu">
                            {visit.status === "todo" ? (
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
                            ) : (
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
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
                
                                 {/* Expanded row for additional details */}
                 {isRowExpanded(visit.id) && (
                   <tr className="lawyer__table-expanded-row">
                     <td
                       colSpan={6}
                       className="lawyer__table-expanded-cell"
                     >
                       <div className="lawyer__expanded-content">
                         <div className="lawyer__expanded-section">
                           <div className="lawyer__expanded-grid">
                             <div className="lawyer__expanded-item">
                               <span className="lawyer__expanded-label">
                                 Title:
                               </span>
                               <span className="lawyer__expanded-value">
                                 {visit.title}
                               </span>
                             </div>
                             <div className="lawyer__expanded-item">
                               <span className="lawyer__expanded-label">
                                 Duration:
                               </span>
                               <span className="lawyer__expanded-value">
                                 {visit.duration_minutes ? `${visit.duration_minutes} minutes` : '—'}
                               </span>
                             </div>
                             <div className="lawyer__expanded-item">
                               <span className="lawyer__expanded-label">
                                 Urgent:
                               </span>
                               <span className="lawyer__expanded-value">
                                 {visit.is_urgent ? "Yes" : "No"}
                               </span>
                             </div>
                             {visit.notes && (
                               <div className="lawyer__expanded-item lawyer__expanded-item--full">
                                 <span className="lawyer__expanded-label">
                                   Notes:
                                 </span>
                                 <span className="lawyer__expanded-value">
                                   {visit.notes}
                                 </span>
                               </div>
                             )}
                             <div className="lawyer__expanded-item">
                               <span className="lawyer__expanded-label">
                                 Created:
                               </span>
                               <span className="lawyer__expanded-value">
                                 {formatDate(visit.created)}
                               </span>
                             </div>
                             <div className="lawyer__expanded-item">
                               <span className="lawyer__expanded-label">
                                 Updated:
                               </span>
                               <span className="lawyer__expanded-value">
                                 {formatDate(visit.updated)}
                               </span>
                             </div>
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
              start: String((pagination.current_page - 1) * pagination.page_size + 1),
              end: String(Math.min(pagination.current_page * pagination.page_size, pagination.total_items)),
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
      <RequestVisitModal
        isOpen={showRequestVisitModal}
        onClose={() => setShowRequestVisitModal(false)}
        onSubmit={handleRequestVisitSubmit}
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
    </>
  );
}

export default function LawyerCaseVisitsPage() {
  return <LawyerCaseVisitsInner />;
}
