"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "../components/LawyerHeader";
import CustomSelect from "../../components/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/css/lawyer.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconSearch, IconCalendar, IconRefresh } from "@tabler/icons-react";

// Mock data - replace with real API calls
const mockCases = [
  {
    id: "23444",
    detaineeName: "Ahmed Khaled",
    detaineeId: "DET001",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "pending",
    lastUpdate: "2023-10-26"
  },
  {
    id: "23445", 
    detaineeName: "Mohammed Ali",
    detaineeId: "DET002",
    clientName: "Smith, John", 
    clientPhone: "(201) 555-0125",
    creationDate: "November 15, 2014",
    status: "in progress",
    lastUpdate: "2023-10-25"
  },
  {
    id: "23446",
    detaineeName: "Omar Hassan",
    detaineeId: "DET003", 
    clientName: "Johnson, Maria",
    clientPhone: "(201) 555-0126", 
    creationDate: "November 14, 2014",
    status: "completed",
    lastUpdate: "2023-10-24"
  },
  {
    id: "23447",
    detaineeName: "Khalil Ahmad",
    detaineeId: "DET004",
    clientName: "Williams, David",
    clientPhone: "(201) 555-0127",
    creationDate: "November 13, 2014", 
    status: "pending",
    lastUpdate: "2023-10-23"
  },
  {
    id: "23448",
    detaineeName: "Yusuf Ibrahim",
    detaineeId: "DET005",
    clientName: "Brown, Lisa",
    clientPhone: "(201) 555-0128",
    creationDate: "November 12, 2014",
    status: "in progress", 
    lastUpdate: "2023-10-22"
  }
];

const statusOptions = [
  "pending",
  "completed", 
  "in progress"
];

function LawyerCasesInner() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
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
    // Filter cases based on search term, status, and date
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

    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split("T")[0];
      filtered = filtered.filter(caseItem => {
        // Convert creation date to comparable format
        const caseDate = new Date(caseItem.creationDate).toISOString().split("T")[0];
        return caseDate === filterDate;
      });
    }

    setFilteredCases(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, dateFilter]);

  // Pagination
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'lawyer__status--pending';
      case 'in progress': return 'lawyer__status--progress';
      case 'completed': return 'lawyer__status--completed';
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
            <button className="lawyer__refresh">
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lawyer__filter">
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder={t("lawyer.cases.allStatuses")?.toString() || "All Statuses"}
                options={statusOptions.map((status) => ({
                  value: status,
                  label: status
                }))}
                includeNullOption={true}
                isSearchable={false}
                instanceId="cases-status-filter"
              />
            </div>

            <div className="lawyer__filter lawyer__filter--date">
              <div className="lawyer__date-picker-wrapper">
                <DatePicker
                  selected={dateFilter}
                  onChange={(date) => setDateFilter(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("lawyer.cases.createdDate")?.toString() || "Created Date"}
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

          {/* Cases Table */}
          <table className="lawyer__table">
            <thead className="lawyer__table-header">
              <tr>
                <th>Case ID</th>
                <th>Detainee Name</th>
                <th>Detainee ID</th>
                <th>Creation Date</th>
                <th>Client Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="lawyer__table-body">
              {currentCases.map((caseItem) => (
                <tr key={caseItem.id} className="lawyer__table-row">
                  <td className="lawyer__table-cell">
                    <Link 
                      href={`/${locale}/lawyer/cases/${caseItem.id}`}
                      className="lawyer__case-id-link"
                    >
                      #{caseItem.id}
                    </Link>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__detainee-name">{caseItem.detaineeName}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__detainee-id">{caseItem.detaineeId}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__creation-date">{caseItem.creationDate}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className="lawyer__client-name">{caseItem.clientName}</span>
                  </td>
                  <td className="lawyer__table-cell">
                    <span className={`lawyer__status ${getStatusClass(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
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
                start: String(indexOfFirstCase + 1),
                end: String(Math.min(indexOfLastCase, filteredCases.length)),
                total: String(filteredCases.length)
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