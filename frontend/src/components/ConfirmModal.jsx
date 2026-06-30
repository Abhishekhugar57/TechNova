import { Modal } from 'react-bootstrap';

const ConfirmModal = ({
  show,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const isPrimary = confirmVariant === 'primary';

  return (
    <Modal show={show} onHide={onCancel} centered className='modal-custom'>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button
          type='button'
          className='btn-outline-custom btn-sm-custom'
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
        <button
          type='button'
          className={isPrimary ? 'btn-primary-custom btn-sm-custom' : 'btn-danger-custom btn-sm-custom'}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
