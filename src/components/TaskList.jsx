import { ClipboardList } from 'lucide-react';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, hasTasks, ...handlers }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <ClipboardList size={32} aria-hidden="true" />
        <p>{hasTasks ? 'No tasks match your search or filters.' : 'No tasks yet. Add your first task to get started.'}</p>
      </div>
    );
  }
  return <ul className="tasks">{tasks.map((t) => <TaskCard key={t.id} task={t} {...handlers} />)}</ul>;
}
