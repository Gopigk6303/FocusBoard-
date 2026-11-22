import { LayoutDashboard, ListChecks, CalendarDays, BarChart3, Settings, Target, X } from 'lucide-react';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, target: 'top' },
  { label: 'My tasks', icon: ListChecks, target: 'tasks-h' },
  { label: 'Calendar', icon: CalendarDays, target: 'tasks-h' },
  { label: 'Reports', icon: BarChart3, target: 'overview' },
  { label: 'Settings', icon: Settings }
];

export default function Sidebar({ open, activeNav, profileName, workspaceName, onNavigate, onClose }) {
  const navigate = (label, target) => {
    onNavigate(label);
    if (target) {
      const element = document.getElementById(target);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClose();
  };
  const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';

  return (
    <>
      {open && <button className="scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Sidebar">
        <div className="brand">
          <span className="brand-mark"><Target aria-hidden="true" size={22} /></span>
          <span>FocusBoard</span>
          <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <ul>
            {NAV.map(({ label, icon: Icon, target }) => (
              <li key={label}>
                <button className={activeNav === label ? 'nav-link active' : 'nav-link'}
                  aria-current={activeNav === label ? 'page' : undefined} onClick={() => navigate(label, target)}>
                  <Icon size={19} aria-hidden="true" /><span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-profile">
          <span className="avatar">{initials}</span>
          <div><strong>{profileName}</strong><span>{workspaceName}</span></div>
        </div>
      </aside>
    </>
  );
}
