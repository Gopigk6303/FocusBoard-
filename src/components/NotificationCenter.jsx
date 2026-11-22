import { Bell, CheckCheck } from 'lucide-react';
import Modal from './Modal';

function formatDueDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationCenter({ notifications, onClose, onMarkRead, onMarkAllRead }) {
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Modal title="Notifications" onClose={onClose}>
      <div className="notification-center">
        <div className="notification-center-heading">
          <p>{unreadCount ? `${unreadCount} unread reminder${unreadCount === 1 ? '' : 's'}` : 'Your task reminders'}</p>
          {unreadCount > 0 && (
            <button type="button" className="btn ghost" onClick={onMarkAllRead}>
              <CheckCheck size={15} aria-hidden="true" />Mark all as read
            </button>
          )}
        </div>
        {notifications.length ? (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button type="button" className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => onMarkRead(notification.id)}
                  aria-label={`${notification.read ? 'Read' : 'Mark as read'}: ${notification.title}`}>
                  <span className="notification-item-icon"><Bell size={16} aria-hidden="true" /></span>
                  <span className="notification-item-copy">
                    <strong>{notification.title}</strong>
                    <span>{notification.message}</span>
                    <small>Due {formatDueDate(notification.dueDate)}</small>
                  </span>
                  {!notification.read && <span className="notification-unread-dot" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="notification-empty">
            <Bell size={25} aria-hidden="true" />
            <p>No task reminders yet</p>
            <span>Reminders for tasks due today or tomorrow will show here.</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
