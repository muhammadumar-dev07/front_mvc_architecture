import DialogShell from "./DialogShell.jsx";

function ConfirmDeleteModal({ product, onClose, onConfirm, isDeleting }) {
  return (
    <DialogShell
      title="Delete product"
      onClose={onClose}
      busy={isDeleting}
      descriptionId="delete-description"
    >
      <div className="confirm-content">
        <p id="delete-description">
          Delete <strong>{product.name}</strong>? This action cannot be undone.
        </p>
        <footer className="dialog-footer">
          <button className="button button-secondary" type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button className="button button-danger" type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </footer>
      </div>
    </DialogShell>
  );
}

export default ConfirmDeleteModal;