import { Pencil, Trash2, Circle, Clock, CheckCircle2, CalendarDays } from 'lucide-react';
import { STATUSES } from '../data/sampleTasks';

const ICONS = { 'To do': Circle, 'In progress': Clock, Completed: CheckCircle2 };
const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');

export default function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const Icon = ICONS[task.status];
  const due = task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date';
  return (
    <li className="task">
      <div className="task-main">
        <h3 className={task.status === 'Completed' ? 'done' : ''}>{task.title}</h3>
        {task.description && <p className="muted">{task.description}</p>}
        <div className="meta">
          <span className="chip">{task.category}</span>
          <span className={`chip prio-${slug(task.priority)}`}>{task.priority} priority</span>
          <span className="muted due"><CalendarDays size={14} aria-hidden="true" />{due}</span>
        </div>
      </div>
      <div className="task-actions">
        <span className={`badge st-${slug(task.status)}`}><Icon size={14} aria-hidden="true" />{task.status}</span>
        <label className="sr-only" htmlFor={`st-${task.id}`}>Change status of {task.title}</label>
        <select id={`st-${task.id}`} value={task.status} onChange={(e) => onStatus(task.id, e.target.value)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={18} /></button>
        <button className="icon-btn danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={18} /></button>
      </div>
    </li>
  );
}
