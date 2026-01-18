import React from "react";
import { IP_STATUSES } from "../../constants/ipStatuses";

const KPIStats = ({ data = [] }) => {
  const getCount = (status) =>
    data.find((s) => s.status === status)?.count || 0;

  const total = data.reduce((acc, s) => acc + s.count, 0);

  // Normalize status for comparison (case-insensitive)
  const getCountNormalized = (status) => {
    const normalizedStatus = status.toUpperCase();
    return data.find((s) => s.status?.toUpperCase() === normalizedStatus)?.count || 0;
  };

  const stats = [
    {
      label: "Total Filings",
      value: total,
      color: "text-purple-300",
    },
    {
      label: "Filed",
      value: getCountNormalized(IP_STATUSES.FILED),
      color: "text-blue-300",
    },
    {
      label: "Under Examination",
      value: getCountNormalized(IP_STATUSES.UNDER_EXAMINATION),
      color: "text-yellow-300",
    },
    {
      label: "Granted",
      value: getCountNormalized(IP_STATUSES.GRANTED),
      color: "text-green-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-lg"
        >
          <p className="text-sm text-gray-300">{s.label}</p>
          <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPIStats;
