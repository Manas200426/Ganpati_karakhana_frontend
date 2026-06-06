export default function StatusBadge({
  status,
}) {
  const statusStyles = {
    PENDING:
      "bg-yellow-100 text-yellow-800",

    IN_PROGRESS:
      "bg-blue-100 text-blue-800",

    PAINTING:
      "bg-orange-100 text-orange-800",

    READY:
      "bg-green-100 text-green-800",

    DELIVERED:
      "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}