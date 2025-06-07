import { hebrewDictionary } from "~/utils/constants";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ open, onConfirm, onCancel }: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white text-center">
        <h3 className="mb-4 text-lg font-bold">
          {hebrewDictionary.confirmDelete}
        </h3>
        <div className="flex justify-center gap-4">
          <button className="btn btn-error" onClick={onConfirm}>
            {hebrewDictionary.confirm}
          </button>
          <button className="btn" onClick={onCancel}>
            {hebrewDictionary.cancel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
