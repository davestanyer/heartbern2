import React from 'react';
import ModalOverlay from './ModalOverlay';

interface ConfirmResetModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <ModalOverlay labelledBy="reset-modal-title" onDismiss={onCancel}>
      <div className="panel text-white p-6 w-96 max-w-full">
        <h2 id="reset-modal-title" className="text-xl font-bold mb-4">
          Every sunset is an opportunity to reset
        </h2>
        <p className="mb-6">Are you sure you want to reset?</p>
        <div className="flex justify-end space-x-4">
          <button className="btn-secondary px-4 py-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger px-4 py-2" onClick={onConfirm}>
            Reset
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ConfirmResetModal;
