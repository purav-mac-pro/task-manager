export default function StatusBadge({ status }) {
  const cls =
    status === 'completed'
      ? 'badge badge-completed'
      : status === 'in-progress'
      ? 'badge badge-in-progress'
      : 'badge badge-pending';

  const label = status === 'in-progress' ? 'In Progress' : status || 'pending';

  return <span className={cls}>{label}</span>;
}
