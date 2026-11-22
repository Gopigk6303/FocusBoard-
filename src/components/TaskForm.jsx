import { useState } from 'react';
import Modal from './Modal';
import { STATUSES, PRIORITIES, CATEGORIES } from '../data/sampleTasks';

const EMPTY = { title: '', description: '', category: CATEGORIES[0], status: 'To do', priority: 'Medium', dueDate: '' };

/** Used for both create (task = null) and edit (task = existing task). */
export default function TaskForm({ task, onSave, onCancel }) {
  const editing = Boolean(task);
  const [values, setValues] = useState(task ? { ...task } : EMPTY);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const title = values.title.trim();
    const errs = {};
    if (!title) errs.title = 'Enter a task title.';
    if (!values.dueDate) errs.dueDate = 'Choose a due date.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...values, title, description: values.description.trim() });
  };

  return (
    <Modal title={editing ? 'Edit task' : 'Create task'} onClose={onCancel}>
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="f-title">Title <span aria-hidden="true">*</span></label>
          <input id="f-title" data-autofocus value={values.title} onChange={set('title')} maxLength={120}
            aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'e-title' : undefined} />
          {errors.title && <p className="error" id="e-title" role="alert">{errors.title}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-desc">Description</label>
          <textarea id="f-desc" rows={3} value={values.description} onChange={set('description')} />
        </div>
        <div className="grid2">
          <div className="field"><label htmlFor="f-status">Status</label>
            <select id="f-status" value={values.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="field"><label htmlFor="f-prio">Priority</label>
            <select id="f-prio" value={values.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></div>
          <div className="field"><label htmlFor="f-cat">Category</label>
            <select id="f-cat" value={values.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label htmlFor="f-due">Due date <span aria-hidden="true">*</span></label>
            <input id="f-due" type="date" value={values.dueDate} onChange={set('dueDate')}
              aria-invalid={Boolean(errors.dueDate)} aria-describedby={errors.dueDate ? 'e-due' : undefined} />
            {errors.dueDate && <p className="error" id="e-due" role="alert">{errors.dueDate}</p>}</div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn primary">{editing ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </Modal>
  );
}
