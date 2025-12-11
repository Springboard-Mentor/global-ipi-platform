import React, { useState } from "react";
import StatusTimeline from "./StatusTimeline";

const TableRow = ({ item, children }) => {
  const [open, setOpen] = useState(false);

  return [
    <tr
      key="main-row"
      className="cursor-pointer hover:bg-white/5"
      onClick={() => setOpen(!open)}
    >
      <td className="py-3">{item.name}</td>
      <td>{item.id}</td>
      <td>{children}</td>
      <td>{item.filedOn}</td>
      <td>{item.updatedOn}</td>
    </tr>,

    open && (
      <tr key="timeline-row">
        <td colSpan="5">
          <StatusTimeline
            status={item.status}
            filedOn={item.filedOn}
            updatedOn={item.updatedOn}
          />
        </td>
      </tr>
    ),
  ];
};

export default TableRow;
