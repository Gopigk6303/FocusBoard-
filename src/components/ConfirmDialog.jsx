import Modal from './Modal';

export default function ConfirmDialog({ task, onConfirm, onCancel }) {
  return (
    <Modal title="Delete task?" onClose={onCancel}>
      <p>“{task.title}” will be permanently removed. This can’t be undone.</p>
      <div className="form-actions">
        <button className="btn ghost" onClick={onCancel} data-autofocus>Cancel</button>
        <button className="btn danger-solid" onClick={onConfirm}>Delete task</button>
      </div>
    </Modal>
  );
}
