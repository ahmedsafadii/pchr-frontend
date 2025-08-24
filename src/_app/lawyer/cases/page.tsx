"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "../components/LawyerHeader";
import CustomSelect from "../../components/CustomSelect";
import "@/app/css/lawyer.css";
import LawyerProtectedLayout from "../../components/LawyerProtectedLayout";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  IconSearch,
  IconRefresh,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { getLawyerCases } from "../../services/api";
import { LawyerAuth } from "../../utils/auth";
import React from "react";

interface Case {
  id: string;
  case_number: string;
  detainee_name: string;
  detainee_id: string;
  detainee_date_of_birth: string;
  client_name: string;
  client_phone: string;
  client_relationship: string;
  status: string;
  status_display: string;
  is_urgent: boolean;
  detention_date: string;
  detention_circumstances: string;
  created: string;
  updated: string;
  detainee_job: string;
  detainee_health_status: string;
  detainee_city: string;
  detainee_governorate: string;
}

interface PaginationInfo {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

function LawyerCasesInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [cases, setCases] = useState<Case[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const statusOptions = [
    { value: "pending", label: t("lawyer.cases.statusOptions.pending") },
    { value: "in_progress", label: t("lawyer.cases.statusOptions.inProgress") },
    { value: "completed", label: t("lawyer.cases.statusOptions.completed") },
    {
      value: "under_review",
      label: t("lawyer.cases.statusOptions.underReview"),
    },
    {
      value: "awaiting_documents",
      label: t("lawyer.cases.statusOptions.awaitingDocuments"),
    },
    {
      value: "detention_confirmed",
      label: t("lawyer.cases.statusOptions.detentionConfirmed"),
    },
    { value: "released", label: t("lawyer.cases.statusOptions.released") },
    { value: "deceased", label: t("lawyer.cases.statusOptions.deceased") },
    {
      value: "enforced_disappearance",
      label: t("lawyer.cases.statusOptions.enforcedDisappearance"),
    },
  ];

  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const urgent = searchParams.get("urgent_only") === "true";
    const page = parseInt(searchParams.get("page") || "1");

    setStatusFilter(status);
    setSearchTerm(search);
    setUrgentOnly(urgent);
    setCurrentPage(page);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: {
      status?: string;
      search?: string;
      urgent_only?: boolean;
      page?: number;
    }) => {
      const params = new URLSearchParams(searchParams);

      if (newFilters.status !== undefined) {
        if (newFilters.status) {
          params.set("status", newFilters.status);
        } else {
          params.delete("status");
        }
      }

      if (newFilters.search !== undefined) {
        if (newFilters.search) {
          params.set("search", newFilters.search);
        } else {
          params.delete("search");
        }
      }

      if (newFilters.urgent_only !== undefined) {
        if (newFilters.urgent_only) {
          params.set("urgent_only", "true");
        } else {
          params.delete("urgent_only");
        }
      }

      if (newFilters.page !== undefined) {
        if (newFilters.page > 1) {
          params.set("page", newFilters.page.toString());
        } else {
          params.delete("page");
        }
      }

      const newURL = params.toString() ? `?${params.toString()}` : "";
      router.push(`/${locale}/lawyer/cases${newURL}`);
    },
    [searchParams, router, locale]
  );

  // Fetch cases from API
  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await getLawyerCases(
        token,
        {
          status: statusFilter || undefined,
          search: searchTerm || undefined,
          page: currentPage,
          page_size: pageSize,
          urgent_only: urgentOnly,
          sort: "created",
          order: "desc",
        },
        locale
      );

      if (response.status === "success" && response.data) {
        setCases(response.data.cases || []);
        setPagination(response.data.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch cases");
      }
    } catch (err: any) {
      console.error("Error fetching cases:", err);
      setError(err.message || "Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, urgentOnly, currentPage, pageSize, locale]);

  // Fetch cases when filters change
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateURL({ status: value, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handleUrgentChange = (value: boolean) => {
    setUrgentOnly(value);
    setCurrentPage(1);
    updateURL({ urgent_only: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setExpandedRows(new Set()); // Reset expanded rows
    fetchCases();
  };

  const toggleRowExpansion = (caseId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(caseId)) {
      newExpandedRows.delete(caseId);
    } else {
      newExpandedRows.add(caseId);
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (caseId: string) => expandedRows.has(caseId);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "lawyer__status--pending";
      case "in_progress":
        return "lawyer__status--progress";
      case "completed":
        return "lawyer__status--completed";
      case "under_review":
        return "lawyer__status--review";
      case "detention_confirmed":
        return "lawyer__status--confirmed";
      case "deceased":
        return "lawyer__status--deceased";
      case "awaiting_documents":
        return "lawyer__status--awaiting";
      case "released":
        return "lawyer__status--released";
      case "enforced_disappearance":
        return "lawyer__status--disappearance";
      default:
        return "lawyer__status--default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <div className="lawyer">
      <div className="lawyer__container">
        {/* Header */}
        <LawyerHeader activeTab="cases" />

        {/* Cases Content */}
        <main className="lawyer__cases">
          <div className="lawyer__cases-header">
            <h1 className="lawyer__cases-title">{t("lawyer.cases.title")}</h1>
            <button className="lawyer__refresh" onClick={handleRefresh}>
              <IconRefresh size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="lawyer__cases-filters">
            <div className="lawyer__search">
              <IconSearch size={20} className="lawyer__search-icon" />
              <input
                type="text"
                className="lawyer__search-input"
                placeholder={t("lawyer.cases.search")?.toString()}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="lawyer__filter">
              <CustomSelect
                value={statusFilter}
                onChange={handleStatusChange}
                placeholder={
                  t("lawyer.cases.allStatuses")?.toString() || "All Statuses"
                }
                options={statusOptions}
                includeNullOption={true}
                isSearchable={false}
                instanceId="cases-status-filter"
              />
            </div>

            <div className="lawyer__filter">
              <CustomSelect
                value={urgentOnly ? "urgent" : "all"}
                onChange={(value) => handleUrgentChange(value === "urgent")}
                placeholder="Filter by urgency"
                options={[
                  { value: "all", label: t("lawyer.cases.urgentFilter.allCases") },
                  { value: "urgent", label: t("lawyer.cases.urgentFilter.onlyUrgent") }
                ]}
                includeNullOption={false}
                isSearchable={false}
                instanceId="cases-urgent-filter"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="lawyer__error">
              {error}
              <button onClick={fetchCases} className="lawyer__retry-button">
                Retry
              </button>
            </div>
          )}

          {/* Cases Table */}
          <div className="lawyer__table-wrapper">
            <table className="lawyer__table">
              <thead className="lawyer__table-header">
                <tr>
                  <th className="lawyer__table-expand-header"></th>
                  <th>{t("lawyer.cases.columns.caseNumber")}</th>
                  <th>{t("lawyer.cases.columns.detaineeName")}</th>
                  <th>{t("lawyer.cases.columns.creationDate")}</th>
                  <th>{t("lawyer.cases.columns.status")}</th>
                </tr>
              </thead>
              <tbody className="lawyer__table-body">
                {loading && (
                  <tr className="lawyer__table-loading-row">
                    <td colSpan={5} className="lawyer__table-loading-cell">
                      <div className="lawyer__table-loading-content">
                        <div className="lawyer__loading-spinner"></div>
                        <span>Loading cases...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && cases.length === 0 && (
                  <tr className="lawyer__table-empty-row">
                    <td colSpan={5} className="lawyer__table-empty-cell">
                      <div className="lawyer__table-empty-content">
                        <span>No cases found</span>
                        {error && (
                          <button onClick={fetchCases} className="lawyer__retry-button">
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && cases.length > 0 && cases.map((caseItem) => (
                  <React.Fragment key={caseItem.id}>
                    <tr className="lawyer__table-row">
                      <td className="lawyer__table-cell lawyer__table-expand-cell">
                        <button
                          className="lawyer__expand-button"
                          onClick={() => toggleRowExpansion(caseItem.id)}
                          aria-label={isRowExpanded(caseItem.id) ? "Collapse row" : "Expand row"}
                        >
                          {isRowExpanded(caseItem.id) ? (
                            <IconChevronDown size={20} />
                          ) : (
                            <IconChevronRight size={20} />
                          )}
                        </button>
                      </td>
                      <td className="lawyer__table-cell">
                        <div className="lawyer__case-number-wrapper">
                          <Link
                            href={`/${locale}/lawyer/cases/${caseItem.id}`}
                            className="lawyer__case-id-link"
                          >
                            {caseItem.case_number}
                          </Link>
                          {caseItem.is_urgent && (
                            <span className="lawyer__case-urgent-badge">
                              <IconAlertCircle size={16} stroke={1.5} />
                              {t("lawyer.dashboard.stats.urgent")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="lawyer__table-cell">
                        <span className="lawyer__detainee-name">
                          {caseItem.detainee_name}
                        </span>
                      </td>
                      <td className="lawyer__table-cell">
                        <span className="lawyer__creation-date">
                          {formatDate(caseItem.created)}
                        </span>
                      </td>
                      <td className="lawyer__table-cell">
                        <span
                          className={`lawyer__status ${getStatusClass(
                            caseItem.status
                          )}`}
                        >
                          {caseItem.status_display}
                        </span>
                      </td>
                    </tr>
                    {isRowExpanded(caseItem.id) && (
                      <tr className="lawyer__table-expanded-row">
                        <td colSpan={5} className="lawyer__table-expanded-cell">
                          <div className="lawyer__expanded-content">
                            <div className="lawyer__expanded-section">
                              <h4>Detainee Information</h4>
                              <div className="lawyer__expanded-grid">
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Full Name:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detainee_name}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">ID Number:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detainee_id}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Date of Birth:</span>
                                  <span className="lawyer__expanded-value">{formatDate(caseItem.detainee_date_of_birth)}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Job:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detainee_job}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Health Status:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detainee_health_status}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">City:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detainee_city}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Governorate:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detainee_governorate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="lawyer__expanded-section">
                              <h4>Client Information</h4>
                              <div className="lawyer__expanded-grid">
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Full Name:</span>
                                  <span className="lawyer__expanded-value">{caseItem.client_name}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Phone Number:</span>
                                  <span className="lawyer__expanded-value">{caseItem.client_phone}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Relationship:</span>
                                  <span className="lawyer__expanded-value">{caseItem.client_relationship}</span>
                                </div>
                              </div>
                            </div>
                            <div className="lawyer__expanded-section">
                              <h4>Detention Information</h4>
                              <div className="lawyer__expanded-grid">
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Detention Date:</span>
                                  <span className="lawyer__expanded-value">{formatDate(caseItem.detention_date)}</span>
                                </div>
                                <div className="lawyer__expanded-item lawyer__expanded-item--full">
                                  <span className="lawyer__expanded-label">Circumstances:</span>
                                  <span className="lawyer__expanded-value">{caseItem.detention_circumstances}</span>
                                </div>
                              </div>
                            </div>
                            <div className="lawyer__expanded-section">
                              <h4>Case Information</h4>
                              <div className="lawyer__expanded-grid">
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Case Number:</span>
                                  <span className="lawyer__expanded-value">{caseItem.case_number}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Status:</span>
                                  <span className="lawyer__expanded-value">{caseItem.status_display}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Urgent:</span>
                                  <span className="lawyer__expanded-value">{caseItem.is_urgent ? "Yes" : "No"}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Created:</span>
                                  <span className="lawyer__expanded-value">{formatDate(caseItem.created)}</span>
                                </div>
                                <div className="lawyer__expanded-item">
                                  <span className="lawyer__expanded-label">Last Updated:</span>
                                  <span className="lawyer__expanded-value">{formatDate(caseItem.updated)}</span>
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
                {t("lawyer.cases.pagination.previous")}
              </button>

              <div className="lawyer__pagination-info">
                {t("lawyer.cases.pagination.showing", {
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
                {t("lawyer.cases.pagination.next")}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function LawyerCasesPage() {
  return (
    <LawyerProtectedLayout>
      <LawyerCasesInner />
    </LawyerProtectedLayout>
  );
}
