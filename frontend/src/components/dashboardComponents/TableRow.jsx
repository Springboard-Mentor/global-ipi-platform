import React, { useState } from "react";
import StatusTimeline from "./StatusTimeline";

const TableRow = ({ item, children, actions }) => {
  const [open, setOpen] = useState(false);

  return [
    <tr
      key="main-row"
      className="cursor-pointer hover:bg-white/5"
      onClick={() => setOpen(!open)}
    >
      <td className="py-3">{item.title || "—"}</td>
      <td>{item.applicationNumber || "—" }</td>
      <td>{children}</td>
      <td>{item.filingDate
          ? new Date(item.filingDate).toLocaleDateString()
          : "—"}</td>
      <td>{item.updatedOn
          ? new Date(item.updatedOn).toLocaleDateString()
          : "—"}</td>
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
