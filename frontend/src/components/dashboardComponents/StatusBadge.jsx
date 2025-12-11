const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-green-400/20 text-green-300 border-green-400/40",
    Pending: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    "In Review": "bg-blue-400/20 text-blue-300 border-blue-400/40",
    Rejected: "bg-red-400/20 text-red-300 border-red-400/40",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
