import { PencilIcon } from "lucide-react";
import { hebrewDictionary } from "~/utils/constants";
import BusinessFormComponent from "./businessForm";
import { type CompleteBusinessForm } from "~/utils/types";

interface EditBusinessDialogProps {
  initialValues?: CompleteBusinessForm;
}

const EditBusinessDialog = ({ initialValues }: EditBusinessDialogProps) => {  
  return (
    <>
      <div
        className="flex items-center justify-between px-2 py-1 hover:bg-gray-100"
        onClick={() =>
          (
            document.getElementById("edit_business") as HTMLDialogElement
          )?.showModal()
        }
      >
        <span className="text-lg font-semibold text-gray-800">
          {hebrewDictionary.editBusiness}
        </span>
        <PencilIcon className="h-5 w-5 text-gray-800" />
      </div>
      <dialog id="edit_business" className="modal sm:modal-middle p-4">
        <div className="modal-box w-full max-w-lg rounded-3xl p-0 shadow-none">
          <div className="flex h-[90vh] flex-col">
            <div className="flex-grow overflow-y-auto">
              <BusinessFormComponent
                initialValues={initialValues}
                mode="edit"
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default EditBusinessDialog;
