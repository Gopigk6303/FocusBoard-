export const STATUSES = ['To do', 'In progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const CATEGORIES = ['Design', 'Development', 'Testing', 'Research'];

export const sampleTasks = [
  { id: 101, title: 'Complete UI design', description: 'Finalise the dashboard screens and component states.', category: 'Design', status: 'In progress', priority: 'High', dueDate: '2026-11-25' },
  { id: 102, title: 'Build React dashboard', description: 'Implement layout, statistics and task list components.', category: 'Development', status: 'In progress', priority: 'High', dueDate: '2026-11-27' },
  { id: 103, title: 'Research accessibility patterns', description: 'Review WCAG guidance for dialogs and carousels.', category: 'Research', status: 'Completed', priority: 'Medium', dueDate: '2026-11-20' },
  { id: 104, title: 'Test login flow', description: 'Verify form validation and error messages.', category: 'Testing', status: 'To do', priority: 'Medium', dueDate: '2026-11-30' },
  { id: 105, title: 'Write project documentation', description: 'Prepare README with setup and state management notes.', category: 'Development', status: 'Completed', priority: 'Low', dueDate: '2026-11-22' },
  { id: 106, title: 'Review colour contrast', description: 'Check text and badge contrast ratios against WCAG AA.', category: 'Design', status: 'Completed', priority: 'Low', dueDate: '2026-11-21' }
];
