"use client";

import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { useLocale, useTranslations } from "next-globe-gen";
import "react-calendar/dist/Calendar.css";

// Mock visit data - replace with real API data
const mockVisits = [
  {
    id: 1,
    date: "2024-12-05",
    caseNumber: "23444",
    clientName: "Ahmed Khaled",
    time: "10:00 AM",
    location: "Prison A"
  },
  {
    id: 2,
    date: "2024-12-05", 
    caseNumber: "23445",
    clientName: "Mohammed Ali",
    time: "2:00 PM",
    location: "Court B"
  },
  {
    id: 3,
    date: "2024-12-15",
    caseNumber: "23446",
    clientName: "Omar Hassan",
    time: "11:00 AM",
    location: "Police Station C"
  },
  {
    id: 4,
    date: "2024-12-20",
    caseNumber: "23447",
    clientName: "Khalil Ahmad",
    time: "3:00 PM",
    location: "Prison D"
  },
  {
    id: 5,
    date: "2024-12-28",
    caseNumber: "23448",
    clientName: "Yusuf Ibrahim",
    time: "9:00 AM",
    location: "Court A"
  },
  {
    id: 6,
    date: "2025-01-08",
    caseNumber: "23449",
    clientName: "Samir Nasser",
    time: "1:00 PM",
    location: "Prison B"
  },
  {
    id: 7,
    date: "2025-01-12",
    caseNumber: "23450",
    clientName: "Hassan Ali",
    time: "10:30 AM",
    location: "Police Station D"
  },
  {
    id: 8,
    date: "2025-01-18",
    caseNumber: "23451",
    clientName: "Ahmad Mahmoud",
    time: "2:30 PM",
    location: "Court C"
  },
  {
    id: 9,
    date: "2025-01-25",
    caseNumber: "23452",
    clientName: "Fadi Khoury",
    time: "11:15 AM",
    location: "Prison C"
  }
];

interface VisitsCalendarProps {
  onCaseClick?: (caseNumber: string) => void;
}

export default function VisitsCalendar({ onCaseClick }: VisitsCalendarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [date, setDate] = useState(new Date(2024, 11, 1)); // December 2024
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Get visits for a specific date
  const getVisitsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockVisits.filter(visit => visit.date === dateString);
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

  // Handle click on calendar tile
  const handleTileClick = (date: Date, event: React.MouseEvent) => {
    const visits = getVisitsForDate(date);
    if (visits.length > 0) {
      event.stopPropagation();
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setHoveredDate(date.toISOString().split('T')[0]);
      setShowTooltip(true);
    }
  };

  // Handle mouse enter on calendar tile
  const handleMouseEnter = (event: React.MouseEvent, date: Date) => {
    const visits = getVisitsForDate(date);
    if (visits.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setHoveredDate(date.toISOString().split('T')[0]);
      setShowTooltip(true);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    // Don't hide tooltip immediately, give some time for user to interact
    setTimeout(() => {
      setShowTooltip(false);
      setHoveredDate(null);
    }, 200);
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
  const handleCaseClick = (caseNumber: string) => {
    if (onCaseClick) {
      onCaseClick(caseNumber);
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
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          showNeighboringMonth={false}
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
              
              setHoveredDate(clickedDate.toISOString().split('T')[0]);
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
                onClick={() => handleCaseClick(visit.caseNumber)}
              >
                <div className="lawyer__calendar-tooltip-case">
                  Case: {visit.clientName}
                </div>
                <div className="lawyer__calendar-tooltip-details">
                  {new Date(visit.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="lawyer__calendar-tooltip-action">
                  Show Case
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      {/* <div className="lawyer__calendar-legend">
        <div className="lawyer__calendar-legend-item">
          <div className="lawyer__calendar-legend-dot lawyer__calendar-legend-dot--today"></div>
          <span>Today</span>
        </div>
        <div className="lawyer__calendar-legend-item">
          <div className="lawyer__calendar-legend-dot lawyer__calendar-legend-dot--visit"></div>
          <span>Visit Day</span>
        </div>
      </div> */}
    </div>
  );
}
