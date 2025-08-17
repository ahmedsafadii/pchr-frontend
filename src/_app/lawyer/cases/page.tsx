"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "../components/LawyerHeader";
import "@/app/css/lawyer.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconSearch, IconCalendar, IconChevronDown, IconEye } from "@tabler/icons-react";

// Mock data - replace with real API calls
const mockCases = [
  {
    id: "23444",
    detaineeName: "Ahmed Khaled",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "Under Review",
    lastUpdate: "2023-10-26"
  },
  {
    id: "23445", 
    detaineeName: "Mohammed Ali",
    clientName: "Smith, John", 
    clientPhone: "(201) 555-0125",
    creationDate: "November 15, 2014",
    status: "In Progress",
    lastUpdate: "2023-10-25"
  },
  {
    id: "23446",
    detaineeName: "Omar Hassan", 
    clientName: "Johnson, Maria",
    clientPhone: "(201) 555-0126", 
    creationDate: "November 14, 2014",
    status: "Completed",
    lastUpdate: "2023-10-24"
  },
  {
    id: "23447",
    detaineeName: "Khalil Ahmad",
    clientName: "Williams, David",
    clientPhone: "(201) 555-0127",
    creationDate: "November 13, 2014", 
    status: "Under Review",
    lastUpdate: "2023-10-23"
  },
  {
    id: "23448",
    detaineeName: "Yusuf Ibrahim",
    clientName: "Brown, Lisa",
    clientPhone: "(201) 555-0128",
    creationDate: "November 12, 2014",
    status: "In Progress", 
    lastUpdate: "2023-10-22"
  }
];

const statusOptions = [
  "Under Review",
  "In Progress", 
  "Completed",
  "Rejected",
  "Awaiting Documents",
  "Released",
  "Enforced Disappearance"
];

function LawyerCasesInner() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredCases, setFilteredCases] = useState(mockCases);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;

  useEffect(() => {
    // Get status filter from URL params
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter cases based on search term and status
    let filtered = mockCases;

    if (searchTerm) {
      filtered = filtered.filter(caseItem => 
        caseItem.detaineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(caseItem => 
        caseItem.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    setFilteredCases(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter]);

  // Pagination
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'under review': return 'lawyer__status--review';
      case 'in progress': return 'lawyer__status--progress';
      case 'completed': return 'lawyer__status--completed';
      case 'rejected': return 'lawyer__status--rejected';
      default: return 'lawyer__status--default';
    }
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
            <button className="lawyer__refresh">🔄</button>
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lawyer__filter">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="lawyer__filter-select"
              >
                <option value="">{t("lawyer.cases.allStatuses")}</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="lawyer__filter">
              <IconCalendar size={20} />
              <span>{t("lawyer.cases.createdDate")}</span>
              <IconChevronDown size={16} />
            </div>
          </div>

          {/* Cases Table */}
          <table className="lawyer__table">
            <thead className="lawyer__table-header">
              <tr>
                <th>{t("lawyer.cases.table.caseNumber")}</th>
                <th>{t("lawyer.cases.table.detaineeName")}</th>
                <th>{t("lawyer.cases.table.clientName")}</th>
                <th>{t("lawyer.cases.table.clientPhone")}</th>
                <th>{t("lawyer.cases.table.status")}</th>
                <th>{t("lawyer.cases.table.lastUpdate")}</th>
                <th>{t("lawyer.cases.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="lawyer__table-body">
              {currentCases.map((caseItem) => (
                <tr key={caseItem.id} className="lawyer__table-row">
                  <td className="lawyer__table-cell">
                    <span className="lawyer__case-number">#{caseItem.id}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <div className="lawyer__detainee-info">
                      <span className="lawyer__detainee-name">{caseItem.detaineeName}</span>
                    </div>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__client-name">{caseItem.clientName}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__client-phone">{caseItem.clientPhone}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className={`lawyer__status ${getStatusClass(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__last-update">{caseItem.lastUpdate}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <Link 
                      href={`/${locale}/lawyer/cases/${caseItem.id}`}
                      className="lawyer__action-button"
                    >
                      <IconEye size={16} />
                      {t("lawyer.cases.table.viewDetails")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="lawyer__pagination">
            <button 
              className="lawyer__pagination-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {t("lawyer.cases.pagination.previous")}
            </button>
            
            <div className="lawyer__pagination-info">
              {t("lawyer.cases.pagination.showing", {
                start: indexOfFirstCase + 1,
                end: Math.min(indexOfLastCase, filteredCases.length),
                total: filteredCases.length
              })}
            </div>
            
            <button 
              className="lawyer__pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {t("lawyer.cases.pagination.next")}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LawyerCasesPage() {
  return <LawyerCasesInner />;
}