import React from "react";

const KPIStats = ({ data }) => {
  const total = data.length;
  const pending = data.filter((d) => d.status === "Pending").length;
  const review = data.filter((d) => d.status === "Pending Review").length;
  const completed = data.filter((d) => d.status === "Completed").length;

  const stats = [
    { label: "Total Filings", value: total, color: "text-purple-300" },
    { label: "Pending", value: pending, color: "text-yellow-300" },
    { label: "Pending Review", value: review, color: "text-blue-300" },
    { label: "Completed", value: completed, color: "text-green-300" },
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
