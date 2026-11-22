import { useState } from 'react';
import { Bell, Building2, Pencil, UserRound } from 'lucide-react';
import Modal from './Modal';

const REMINDER_TIMINGS = {
  day_before: 'One day before',
  due_date: 'On the due date',
  both_days: 'One day before and on the due date'
};

export default function SettingsPage({ settings, onSave, browserPermission, onEnableBrowserNotifications, notificationError }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(settings);

  const openEditor = () => {
    setDraft(settings);
    setEditing(true);
  };
  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setDraft((current) => ({ ...current, [key]: value }));
  };
  const save = (event) => {
    event.preventDefault();
    onSave(draft);
    setEditing(false);
  };

  return (
    <>
      <div className="settings-intro">
        <div>
          <h2>General settings</h2>
          <p>Manage your profile, workspace, and notification preferences.</p>
        </div>
        <button className="btn primary" onClick={openEditor}>
          <Pencil size={16} aria-hidden="true" />Edit settings
        </button>
      </div>

      <div className="settings-grid">
        <section className="card settings-card" aria-labelledby="profile-settings-title">
          <div className="settings-section-title">
            <span className="settings-icon"><UserRound size={18} aria-hidden="true" /></span>
            <div>
              <h3 id="profile-settings-title">Profile</h3>
              <p>Your personal workspace identity.</p>
            </div>
          </div>
          <div className="settings-row">
            <span>Display name</span>
            <strong>{settings.profileName}</strong>
          </div>
        </section>

        <section className="card settings-card" aria-labelledby="workspace-settings-title">
          <div className="settings-section-title">
            <span className="settings-icon"><Building2 size={18} aria-hidden="true" /></span>
            <div>
              <h3 id="workspace-settings-title">Workspace</h3>
              <p>Identify the space where you organize tasks.</p>
            </div>
          </div>
          <div className="settings-row">
            <span>Workspace name</span>
            <strong>{settings.workspaceName}</strong>
          </div>
        </section>

        <section className="card settings-card settings-notifications" aria-labelledby="notification-settings-title">
          <div className="settings-section-title">
            <span className="settings-icon"><Bell size={18} aria-hidden="true" /></span>
            <div>
              <h3 id="notification-settings-title">Notifications</h3>
              <p>Choose which reminders and updates you receive.</p>
            </div>
          </div>
          <div className="settings-row">
            <div><strong>Task reminders</strong><small>Reminders for upcoming task due dates</small></div>
            <span className={`setting-status ${settings.taskReminders ? 'enabled' : ''}`}>
              {settings.taskReminders ? 'On' : 'Off'}
            </span>
          </div>
          <div className="settings-row">
            <div><strong>Weekly summary</strong><small>A weekly overview of your task progress</small></div>
            <span className={`setting-status ${settings.weeklySummary ? 'enabled' : ''}`}>
              {settings.weeklySummary ? 'On' : 'Off'}
            </span>
          </div>
          <div className="settings-row">
            <div><strong>Reminder timing</strong><small>When active tasks should notify you</small></div>
            <strong>{REMINDER_TIMINGS[settings.reminderTiming]}</strong>
          </div>
          <div className="settings-row browser-alert-row">
            <div>
              <strong>Browser alerts</strong>
              <small>
                {browserPermission === 'granted' ? 'Browser notifications are enabled.' :
                  browserPermission === 'denied' ? 'Allow notifications in your browser settings to enable alerts.' :
                    browserPermission === 'unsupported' ? 'This browser does not support notifications.' :
                      'Enable browser notifications for alerts outside the app.'}
              </small>
            </div>
            {browserPermission === 'granted' ? (
              <span className="setting-status enabled">Enabled</span>
            ) : browserPermission === 'default' ? (
              <button type="button" className="btn ghost" onClick={onEnableBrowserNotifications}>Enable alerts</button>
            ) : (
              <span className="setting-status">Unavailable</span>
            )}
          </div>
          {notificationError && <p className="notification-error" role="alert">{notificationError}</p>}
        </section>
      </div>

      {editing && (
        <Modal title="Edit settings" onClose={() => setEditing(false)}>
          <form onSubmit={save}>
            <div className="field">
              <label htmlFor="settings-profile-name">Display name</label>
              <input id="settings-profile-name" value={draft.profileName} onChange={update('profileName')}
                maxLength={60} required data-autofocus />
            </div>
            <div className="field">
              <label htmlFor="settings-workspace-name">Workspace name</label>
              <input id="settings-workspace-name" value={draft.workspaceName} onChange={update('workspaceName')}
                maxLength={60} required />
            </div>
            <fieldset className="settings-toggle-group">
              <legend>Notifications</legend>
              <label className="settings-toggle">
                <span><strong>Task reminders</strong><small>Reminders for upcoming task due dates</small></span>
                <input type="checkbox" checked={draft.taskReminders} onChange={update('taskReminders')} />
              </label>
              <label className="settings-toggle">
                <span><strong>Weekly summary</strong><small>A weekly overview of your task progress</small></span>
                <input type="checkbox" checked={draft.weeklySummary} onChange={update('weeklySummary')} />
              </label>
              <div className="field reminder-timing-field">
                <label htmlFor="settings-reminder-timing">Remind me</label>
                <select id="settings-reminder-timing" value={draft.reminderTiming} onChange={update('reminderTiming')}>
                  <option value="day_before">One day before the due date</option>
                  <option value="due_date">On the due date</option>
                  <option value="both_days">One day before and on the due date</option>
                </select>
              </div>
            </fieldset>
            <div className="form-actions">
              <button type="button" className="btn ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn primary">Save changes</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
