import { Menu, Plus, Bell } from 'lucide-react';

export default function Header({ onMenu, onAdd, onNotifications, unreadNotifications = 0, title = 'My tasks', description }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <header className="topbar" id="top">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={22} /></button>
      <div className="page-heading">
        <p className="eyebrow">{title === 'Settings' ? 'Workspace' : 'Overview'}</p>
        <h1>{title}</h1>
        <p className="muted">{description || today}</p>
      </div>
      <div className="header-actions">
        <button className="icon-btn notification" onClick={onNotifications}
          aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}>
          <Bell size={20} />{unreadNotifications > 0 && <span />}
        </button>
        {onAdd && <button className="btn primary" onClick={onAdd}><Plus size={18} aria-hidden="true" /><span>Add task</span></button>}
      </div>
    </header>
  );
}
