type ConfirmationModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => (
  <div className="modal" tabIndex={-1} style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onCancel}
          ></button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;
