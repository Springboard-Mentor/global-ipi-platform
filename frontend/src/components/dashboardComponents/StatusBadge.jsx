const StatusBadge = ({ status }) => {
  // Normalize status to uppercase for consistent matching
  const normalizedStatus = status ? status.toUpperCase() : "UNKNOWN";
  
  // Map backend statuses to display names and styles
  const statusConfig = {
    GRANTED: {
      label: "Granted",
      style: "bg-green-500 text-white border-green-600"
    },
    FILED: {
      label: "Filed",
      style: "bg-blue-500 text-white border-blue-600"
    },
    UNDER_EXAMINATION: {
      label: "Under Examination",
      style: "bg-yellow-500 text-black border-yellow-600"
    },
    PENDING_REVIEW: {
      label: "Pending Review",
      style: "bg-orange-500 text-white border-orange-600"
    },
    EXPIRED: {
      label: "Expired",
      style: "bg-gray-500 text-white border-gray-600"
    },
    PUBLISHED: {
      label: "Published",
      style: "bg-purple-500 text-white border-purple-600"
    },
    UNKNOWN: {
      label: "Unknown",
      style: "bg-red-500 text-white border-red-600"
    }
  };

  // Get config for status or default to UNKNOWN
  const config = statusConfig[normalizedStatus] || statusConfig.UNKNOWN;

  return (
    <span className={`px-3 py-1 text-xs rounded-full border ${config.style}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
