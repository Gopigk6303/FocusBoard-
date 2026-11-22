import { useEffect, useMemo, useRef, useState } from 'react';
import { ListTodo, Clock, CheckCircle2, Percent } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import FocusNotes from './components/FocusNotes';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import SettingsPage from './components/SettingsPage';
import NotificationCenter from './components/NotificationCenter';
import useLocalStorage from './hooks/useLocalStorage';
import { sampleTasks } from './data/sampleTasks';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SETTINGS = {
  profileName: 'Gopal',
  workspaceName: 'Personal workspace',
  taskReminders: true,
  weeklySummary: false,
  reminderTiming: 'both_days'
};

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function calendarDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / DAY_IN_MS;
}

function getTaskReminders(tasks, reminderTiming, today) {
  const todayNumber = calendarDay(today);
  if (todayNumber === null) return [];

  return tasks.flatMap((task) => {
    if (task.status === 'Completed' || !task.dueDate) return [];
    const dueNumber = calendarDay(task.dueDate);
    if (dueNumber === null) return [];
    const daysUntilDue = dueNumber - todayNumber;
    const kinds = [];
    if (daysUntilDue === 1 && ['day_before', 'both_days'].includes(reminderTiming)) kinds.push('day-before');
    if (daysUntilDue === 0 && ['due_date', 'both_days'].includes(reminderTiming)) kinds.push('due-today');
    return kinds.map((kind) => ({
      id: `${task.id}-${task.dueDate}-${kind}`,
      title: task.title,
      dueDate: task.dueDate,
      message: kind === 'day-before' ? 'This task is due tomorrow.' : 'This task is due today.',
      read: false,
      browserSent: false
    }));
  });
}

function showBrowserNotification(notification) {
  try {
    new Notification('FocusBoard task reminder', {
      body: `${notification.title} — ${notification.message}`,
      tag: notification.id
    });
    return true;
  } catch (error) {
    console.error('Could not display a browser notification.', error);
    return false;
  }
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks);
  const [settings, setSettings] = useLocalStorage('focusboard_settings', DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useLocalStorage('focusboard_notifications', []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [menu, setMenu] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [today, setToday] = useState(() => dateKey(new Date()));
  const [browserPermission, setBrowserPermission] = useState(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  const [notificationError, setNotificationError] = useState('');
  const seenReminderIds = useRef(new Set());
  const settingsView = activeNav === 'Settings';
  const profileName = typeof settings.profileName === 'string' ? settings.profileName : DEFAULT_SETTINGS.profileName;
  const workspaceName = typeof settings.workspaceName === 'string' ? settings.workspaceName : DEFAULT_SETTINGS.workspaceName;
  const safeSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    profileName,
    workspaceName,
    taskReminders: typeof settings.taskReminders === 'boolean' ? settings.taskReminders : DEFAULT_SETTINGS.taskReminders,
    weeklySummary: typeof settings.weeklySummary === 'boolean' ? settings.weeklySummary : DEFAULT_SETTINGS.weeklySummary,
    reminderTiming: ['day_before', 'due_date', 'both_days'].includes(settings.reminderTiming)
      ? settings.reminderTiming : DEFAULT_SETTINGS.reminderTiming
  };

  useEffect(() => {
    const interval = setInterval(() => setToday(dateKey(new Date())), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!safeSettings.taskReminders) return;
    const knownIds = new Set(notifications.map((notification) => notification.id));
    const dueReminders = getTaskReminders(tasks, safeSettings.reminderTiming, today);
    const newReminders = dueReminders.filter((notification) =>
      !knownIds.has(notification.id) && !seenReminderIds.current.has(notification.id));
    if (!newReminders.length) return;

    newReminders.forEach((notification) => seenReminderIds.current.add(notification.id));
    const additions = newReminders.map((notification) => {
      const browserSent = browserPermission === 'granted' && showBrowserNotification(notification);
      return { ...notification, browserSent, createdAt: new Date().toISOString() };
    });
    if (browserPermission === 'granted' && additions.some((notification) => !notification.browserSent)) {
      setNotificationError('Some browser alerts could not be displayed. In-app reminders are still available.');
    }
    setNotifications((current) => {
      const currentIds = new Set(current.map((notification) => notification.id));
      const fresh = additions.filter((notification) => !currentIds.has(notification.id));
      return fresh.length ? [...fresh, ...current] : current;
    });
  }, [tasks, notifications, safeSettings.taskReminders, safeSettings.reminderTiming, today, browserPermission, setNotifications]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'In progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    return { total, inProgress, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) =>
      (!q || t.title.toLowerCase().includes(q)) &&
      (status === 'All' || t.status === status) &&
      (priority === 'All' || t.priority === priority));
  }, [tasks, query, status, priority]);

  const tabCounts = useMemo(() => ({
    All: tasks.length,
    'To do': tasks.filter((t) => t.status === 'To do').length,
    'In progress': stats.inProgress,
    Completed: stats.completed
  }), [tasks, stats]);

  const saveTask = (values) => {
    if (form.task) setTasks((ts) => ts.map((t) => (t.id === form.task.id ? { ...t, ...values, id: t.id } : t)));
    else setTasks((ts) => [{ ...values, id: Date.now() }, ...ts]);
    setForm(null);
  };
  const changeStatus = (id, s) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status: s } : t)));
  const confirmDelete = () => { setTasks((ts) => ts.filter((t) => t.id !== toDelete.id)); setToDelete(null); };
  const resetFilters = () => { setQuery(''); setStatus('All'); setPriority('All'); };
  const unreadNotifications = notifications.filter((notification) => !notification.read).length;
  const markNotificationRead = (id) => setNotifications((current) =>
    current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  const markAllNotificationsRead = () => setNotifications((current) =>
    current.map((notification) => ({ ...notification, read: true })));

  const enableBrowserNotifications = async () => {
    setNotificationError('');
    if (typeof Notification === 'undefined') {
      setBrowserPermission('unsupported');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission !== 'granted') return;

      const activeIds = new Set(getTaskReminders(tasks, safeSettings.reminderTiming, today).map((item) => item.id));
      const pending = notifications.filter((item) => activeIds.has(item.id) && !item.browserSent);
      const sentIds = new Set(pending.filter(showBrowserNotification).map((item) => item.id));
      if (sentIds.size !== pending.length) {
        setNotificationError('Some browser alerts could not be displayed. In-app reminders are still available.');
      }
      if (sentIds.size) {
        setNotifications((current) => current.map((item) =>
          sentIds.has(item.id) ? { ...item, browserSent: true } : item));
      }
    } catch (error) {
      console.error('Could not request browser notification permission.', error);
      setNotificationError('Browser notification permission could not be requested.');
    }
  };

  return (
    <div className="app">
      <Sidebar open={menu} activeNav={activeNav} profileName={profileName} workspaceName={workspaceName}
        onNavigate={setActiveNav} onClose={() => setMenu(false)} />
      <div className="content">
        <Header
          title={settingsView ? 'Settings' : 'My tasks'}
          description={settingsView ? 'Manage your profile, workspace, and notifications.' : undefined}
          onNotifications={() => setNotificationsOpen(true)}
          unreadNotifications={unreadNotifications}
          onMenu={() => setMenu(true)}
          onAdd={settingsView ? undefined : () => setForm({ task: null })}
        />
        <main>
          {settingsView ? (
            <SettingsPage settings={safeSettings} onSave={setSettings} browserPermission={browserPermission}
              onEnableBrowserNotifications={enableBrowserNotifications} notificationError={notificationError} />
          ) : (
            <>
              <section className="stats" id="overview" aria-label="Overview">
                <StatCard title="Total tasks" value={stats.total} icon={ListTodo} tone="blue" />
                <StatCard title="In progress" value={stats.inProgress} icon={Clock} tone="amber" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} tone="green" />
                <StatCard title="Completion" value={`${stats.pct}%`} icon={Percent} tone="violet" />
              </section>
              <FocusNotes />
              <section className="card" aria-labelledby="tasks-h">
                <h2 id="tasks-h">Tasks</h2>
                <div className="toolbar">
                  <SearchBar value={query} onChange={setQuery} />
                  <FilterTabs status={status} priority={priority} counts={tabCounts}
                    onStatus={setStatus} onPriority={setPriority} onReset={resetFilters} />
                </div>
                <TaskList tasks={visible} hasTasks={tasks.length > 0}
                  onEdit={(task) => setForm({ task })} onDelete={setToDelete} onStatus={changeStatus} />
              </section>
            </>
          )}
        </main>
      </div>
      {form && <TaskForm task={form.task} onSave={saveTask} onCancel={() => setForm(null)} />}
      {toDelete && <ConfirmDialog task={toDelete} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
      {notificationsOpen && <NotificationCenter notifications={notifications} onClose={() => setNotificationsOpen(false)}
        onMarkRead={markNotificationRead} onMarkAllRead={markAllNotificationsRead} />}
    </div>
  );
}
