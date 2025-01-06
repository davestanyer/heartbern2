import React from 'react';

interface ConfirmResetModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Every sunset is an opportunity to reset</h2>
        <p className="mb-6">Are you sure you want to reset?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetModal;