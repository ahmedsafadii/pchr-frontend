"use client";

import { useTranslations } from "next-globe-gen";
import LawyerHeader from "../components/LawyerHeader";
import CustomSelect from "../../components/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/lawyer.css";
import LawyerProtectedLayout from "../../components/LawyerProtectedLayout";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconSearch,
  IconCalendar,
  IconCheck,
  IconX,
  IconDots,
  IconFileText,
  IconRefresh,
} from "@tabler/icons-react";
import RequestVisitModal from "../../components/modals/RequestVisitModal";
import VisitOutcomeModal from "../../components/modals/VisitOutcomeModal";
import VisitRejectionModal from "../../components/modals/VisitRejectionModal";

// Mock visits data - replace with real API calls
const mockVisits = [
  {
    id: "V001",
    visitDate: "2024-02-15",
    detaineeName: "Ahmed Khaled",
    clientName: "Cooper, Kristin",
    prisonName: "Central Prison Gaza",
    status: "pending",
    caseNumber: "23444",
  },
  {
    id: "V002",
    visitDate: "2024-02-16",
    detaineeName: "Mohammed Ali",
    clientName: "Smith, John",
    prisonName: "Ofer Military Prison",
    status: "approved",
    caseNumber: "23445",
  },
  {
    id: "V003",
    visitDate: "2024-02-17",
    detaineeName: "Omar Hassan",
    clientName: "Johnson, Maria",
    prisonName: "Megiddo Prison",
    status: "rejected",
    caseNumber: "23446",
  },
  {
    id: "V004",
    visitDate: "2024-02-18",
    detaineeName: "Khalil Ahmad",
    clientName: "Williams, David",
    prisonName: "Gilboa Prison",
    status: "pending",
    caseNumber: "23447",
  },
  {
    id: "V005",
    visitDate: "2024-02-19",
    detaineeName: "Yusuf Ibrahim",
    clientName: "Brown, Lisa",
    prisonName: "Ramon Prison",
    status: "approved",
    caseNumber: "23448",
  },
  {
    id: "V006",
    visitDate: "2024-02-20",
    detaineeName: "Samir Nasser",
    clientName: "Davis, Michael",
    prisonName: "Ashkelon Prison",
    status: "pending",
    caseNumber: "23449",
  },
  {
    id: "V007",
    visitDate: "2024-02-21",
    detaineeName: "Hassan Ali",
    clientName: "Wilson, Sarah",
    prisonName: "Hadarim Prison",
    status: "rejected",
    caseNumber: "23450",
  },
  {
    id: "V008",
    visitDate: "2024-02-22",
    detaineeName: "Ahmad Mahmoud",
    clientName: "Miller, James",
    prisonName: "Nafha Prison",
    status: "approved",
    caseNumber: "23451",
  },
];

const statusOptions = ["pending", "approved", "rejected"];

function LawyerVisitsInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [filteredVisits, setFilteredVisits] = useState(mockVisits);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showRequestVisitModal, setShowRequestVisitModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const visitsPerPage = 10;

  useEffect(() => {
    // Get status filter from URL params
    const status = searchParams.get("status");
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter visits based on search term, status, and date
    let filtered = mockVisits;

    if (searchTerm) {
      filtered = filtered.filter(
        (visit) =>
          visit.detaineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.prisonName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((visit) =>
        visit.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split("T")[0];
      filtered = filtered.filter((visit) => visit.visitDate === filterDate);
    }

    setFilteredVisits(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, dateFilter]);

  // Pagination
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = filteredVisits.slice(
    indexOfFirstVisit,
    indexOfLastVisit
  );
  const totalPages = Math.ceil(filteredVisits.length / visitsPerPage);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "lawyer__status--pending";
      case "approved":
        return "lawyer__status--approved";
      case "rejected":
        return "lawyer__status--rejected";
      default:
        return "lawyer__status--default";
    }
  };

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



  const handleRequestVisitSubmit = (data: any) => {
    // Handle request visit submission - replace with actual API call
    console.log('Request visit data:', data);
  };

  const handleOutcomeSubmit = (outcome: string) => {
    // Handle outcome submission - replace with actual API call
    console.log(`Visit ${selectedVisitId} outcome:`, outcome);
  };

  const handleRejectionSubmit = (reason: string) => {
    // Handle rejection submission - replace with actual API call
    console.log(`Visit ${selectedVisitId} rejection reason:`, reason);
  };

  const handleRefresh = () => {
    // Handle refresh action - reload data from API
    console.log('Refreshing visits data...');
    // In real app, make API call to refresh visits data
    // For now, reset filters and reload mock data
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter(null);
    setFilteredVisits(mockVisits);
    setCurrentPage(1);
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
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <div className="lawyer">
      <div className="lawyer__container">
        {/* Header */}
        <LawyerHeader activeTab="cases" />

        {/* Visits Content */}
        <main className="lawyer__cases">
          <div className="lawyer__cases-header">
            <h1 className="lawyer__cases-title">{t("lawyer.visits.title")}</h1>
            <div className="lawyer__header-actions">
              <button className="lawyer__refresh" onClick={handleRefresh}>
                <IconRefresh size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="lawyer__cases-filters">
            <div className="lawyer__search">
              <IconSearch size={20} className="lawyer__search-icon" />
              <input
                type="text"
                className="lawyer__search-input"
                placeholder={t("lawyer.visits.search")?.toString()}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lawyer__filter">
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder={
                  t("lawyer.visits.allStatuses")?.toString() || "All Statuses"
                }
                options={statusOptions.map((status) => ({
                  value: status,
                  label:
                    t(`lawyer.visits.statusOptions.${status}` as any) || status,
                }))}
                includeNullOption={true}
                isSearchable={false}
                instanceId="visits-status-filter"
              />
            </div>

            <div className="lawyer__filter lawyer__filter--date">
              <div className="lawyer__date-picker-wrapper">
                <DatePicker
                  selected={dateFilter}
                  onChange={(date) => setDateFilter(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={
                    t("lawyer.visits.visitDate")?.toString() || "Visit Date"
                  }
                  className="lawyer__date-picker-input"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                />
                <IconCalendar size={20} className="lawyer__date-picker-icon" />
              </div>
            </div>
          </div>

          {/* Visits Table */}
          <div className="lawyer__table-wrapper">
            <table className="lawyer__table">
            <thead className="lawyer__table-header">
              <tr>
                <th>{t("lawyer.visits.table.visitDate")}</th>
                <th>{t("lawyer.visits.table.detaineeName")}</th>
                <th>{t("lawyer.visits.table.clientName")}</th>
                <th>{t("lawyer.visits.table.prisonName")}</th>
                <th>{t("lawyer.visits.table.status")}</th>
                <th style={{ width: "100px" }}>
                  {t("lawyer.visits.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="lawyer__table-body">
              {currentVisits.map((visit) => (
                <tr key={visit.id} className="lawyer__table-row">
                  <td className="lawyer__table-cell">
                    <span className="lawyer__visit-date">
                      {visit.visitDate}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__detainee-name">
                      {visit.detaineeName}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__client-name">
                      {visit.clientName}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__prison-name">
                      {visit.prisonName}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span
                      className={`lawyer__status ${getStatusClass(
                        visit.status
                      )}`}
                    >
                      {t(`lawyer.visits.statusOptions.${visit.status}` as any)}
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
                            {visit.status === "pending" ? (
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
              ))}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="lawyer__pagination">
            <button
              className="lawyer__pagination-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {t("lawyer.visits.pagination.previous")}
            </button>

            <div className="lawyer__pagination-info">
              {t("lawyer.visits.pagination.showing", {
                start: String(indexOfFirstVisit + 1),
                end: String(Math.min(indexOfLastVisit, filteredVisits.length)),
                total: String(filteredVisits.length),
              })}
            </div>

            <button
              className="lawyer__pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {t("lawyer.visits.pagination.next")}
            </button>
          </div>
        </main>
      </div>

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
