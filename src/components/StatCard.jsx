export default function StatCard({ title, value, icon: Icon, tone }) {
  return (
    <div className={`stat tone-${tone}`}>
      <span className="stat-icon"><Icon size={20} aria-hidden="true" /></span>
      <div>
        <p className="muted">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
