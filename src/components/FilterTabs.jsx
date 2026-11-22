import { STATUSES, PRIORITIES } from '../data/sampleTasks';

export default function FilterTabs({ status, priority, onStatus, onPriority, onReset, counts }) {
  const tabs = ['All', ...STATUSES];
  return (
    <div className="filters">
      <div className="tabs" role="tablist" aria-label="Filter by status">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={status === t} className={`tab ${status === t ? 'active' : ''}`}
            onClick={() => onStatus(t)}>{t} <span className="count">{counts[t]}</span></button>
        ))}
      </div>
      <div className="row">
        <label className="sr-only" htmlFor="prio-filter">Filter by priority</label>
        <select id="prio-filter" value={priority} onChange={(e) => onPriority(e.target.value)}>
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <button className="btn ghost" onClick={onReset}>Reset filters</button>
      </div>
    </div>
  );
}
