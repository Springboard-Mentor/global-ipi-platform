import React, { useState } from "react";
import StatusTimeline from "./StatusTimeline";

// Helper function to format dates from backend (LocalDate serialized as "YYYY-MM-DD")
const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  
  try {
    // Handle both Date objects and date strings (YYYY-MM-DD format from backend)
    let date;
    if (typeof dateValue === 'string') {
      // Backend sends LocalDate as "YYYY-MM-DD" string
      date = new Date(dateValue + 'T00:00:00'); // Add time to avoid timezone issues
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return "—";
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "—";
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error, dateValue);
    return "—";
  }
};

const TableRow = ({ item, children, actions }) => {
  const [open, setOpen] = useState(false);

  return [
    <tr
      key="main-row"
      className="cursor-pointer hover:bg-white/5"
      onClick={() => setOpen(!open)}
    >
      <td className="py-3">{item.title || "—"}</td>
      <td>{item.applicationNumber || "—"}</td>
      <td>{children}</td>
      <td>{formatDate(item.filingDate)}</td>
      <td>{formatDate(item.updatedOn)}</td>
      <td>{actions}</td>
    </tr>,

    open && (
      <tr key="timeline-row">
        <td colSpan="6">
          <StatusTimeline
            status={item.legalStatus || "—"}
            filedOn={item.filingDate}
            updatedOn={item.updatedOn}
          />
        </td>
      </tr>
    ),
  ];
};

export default TableRow;
