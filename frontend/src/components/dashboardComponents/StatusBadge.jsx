const StatusBadge = ({ status }) => {
  // Normalize status to uppercase for consistent matching
  const normalizedStatus = status ? status.toUpperCase() : "UNKNOWN";
  
  // Map backend statuses to display names and styles
  const statusConfig = {
    GRANTED: {
      label: "Granted",
      style: "bg-green-400/20 text-green-300 border-green-400/40"
    },
    FILED: {
      label: "Filed",
      style: "bg-blue-400/20 text-blue-300 border-blue-400/40"
    },
    UNDER_EXAMINATION: {
      label: "Under Examination",
      style: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40"
    },
    PENDING_REVIEW: {
      label: "Pending Review",
      style: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40"
    },
    EXPIRED: {
      label: "Expired",
      style: "bg-gray-400/20 text-gray-300 border-gray-400/40"
    },
    PUBLISHED: {
      label: "Published",
      style: "bg-blue-400/20 text-blue-300 border-blue-400/40"
    },
    UNKNOWN: {
      label: "Unknown",
      style: "bg-gray-400/20 text-gray-300 border-gray-400/40"
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
