"use client";

import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useLocale, useTranslations } from "next-globe-gen";
import { UpcomingVisit } from "../../../types/case";

interface VisitsCalendarProps {
  onCaseClick?: (caseId: string) => void;
  upcomingVisits?: UpcomingVisit[];
}

export default function VisitsCalendar({ onCaseClick, upcomingVisits = [] }: VisitsCalendarProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [date, setDate] = useState(new Date()); // Current date
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Debug: Log the visits data
  useEffect(() => {
  }, [upcomingVisits]);

  // Get visits for a specific date
  const getVisitsForDate = (date: Date) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const visitsForDate = upcomingVisits.filter(visit => visit.visit_approved_date === dateString);
    
    return visitsForDate;
  };

  // Check if date has visits
  const hasVisits = (date: Date) => {
    return getVisitsForDate(date).length > 0;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Custom tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const visits = getVisitsForDate(date);
      if (visits.length > 0) {
        return (
          <div className="lawyer__calendar-tile-indicator">
            <div className="lawyer__calendar-visit-dot"></div>
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile class name
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const classes = [];
      
      if (isToday(date)) {
        classes.push('lawyer__calendar-tile--today');
      }
      
      if (hasVisits(date)) {
        classes.push('lawyer__calendar-tile--has-visits');
      }
      
      return classes.join(' ');
    }
    return '';
  };

  // Handle case click
  const handleCaseClick = (caseId: string) => {
    if (onCaseClick) {
      onCaseClick(caseId);
    }
    setHoveredDate(null);
    setShowTooltip(false);
  };

  const hoveredVisits = hoveredDate ? getVisitsForDate(new Date(hoveredDate)) : [];

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
        setHoveredDate(null);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="lawyer__visits-calendar">
      <div className="lawyer__calendar-wrapper">
        <Calendar
          onChange={setDate as any}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          showNeighboringMonth={false}
          locale={locale}
          formatMonth={(locale, date) => 
            date.toLocaleDateString(locale, { month: 'long' })
          }
          formatMonthYear={(locale, date) => 
            date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
          }
          formatShortWeekday={(locale, date) => 
            date.toLocaleDateString(locale, { weekday: 'narrow' }).toUpperCase()
          }
          onClickDay={(clickedDate, event) => {
            setDate(clickedDate);
            // Check if clicked date has visits
            const visits = getVisitsForDate(clickedDate);
            if (visits.length > 0) {
              // Get the position of the clicked tile
              const target = event.target as HTMLElement;
              const tile = target.closest('.react-calendar__tile') as HTMLElement;
              
              if (tile) {
                const rect = tile.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10
                });
              } else {
                // Fallback position
                setTooltipPosition({
                  x: event.clientX,
                  y: event.clientY - 50
                });
              }
              
              // Use local date string to avoid timezone issues
              const year = clickedDate.getFullYear();
              const month = String(clickedDate.getMonth() + 1).padStart(2, '0');
              const day = String(clickedDate.getDate()).padStart(2, '0');
              const localDateString = `${year}-${month}-${day}`;
              setHoveredDate(localDateString);
              setShowTooltip(true);
            }
          }}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) setDate(activeStartDate);
          }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredDate && hoveredVisits.length > 0 && (
        <div 
          ref={tooltipRef}
          className="lawyer__calendar-tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => {
            setTimeout(() => {
              setShowTooltip(false);
              setHoveredDate(null);
            }, 200);
          }}
        >
          <div className="lawyer__calendar-tooltip-content">
            {hoveredVisits.map((visit) => (
              <div 
                key={visit.id} 
                className="lawyer__calendar-tooltip-item"
                onClick={() => handleCaseClick(visit.case_id)}
              >
                <div className="lawyer__calendar-tooltip-case">
                  {visit.case_number}: {visit.detainee_name}
                  {visit.is_urgent && (
                                            <span className="lawyer__calendar-urgent-badge">{t("common.urgent")}</span>
                  )}
                </div>
                <div className="lawyer__calendar-tooltip-details">
                  <div>{visit.prison_name}</div>
                  {visit.visit_time && <div>{visit.visit_time}</div>}
                </div>
                <div className="lawyer__calendar-tooltip-action">
                  {t("lawyer.dashboard.showCase")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
