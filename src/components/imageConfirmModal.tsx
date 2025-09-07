import Image from "next/image";
import { hebrewDictionary } from "~/utils/constants";

const ImageConfirmModal = ({
  showModal,
  image,
  setShowModal,
  handleUpload,
  setProfileImage,
}: {
  showModal: boolean;
  image: File | null;
  setShowModal: (value: boolean) => void;
  handleUpload: () => void;
  setProfileImage: (image: File | null) => void;
}) => {
  return (
    <dialog className={`modal ${showModal ? "modal-open" : ""}`}>
      <div className="modal-box rounded-xl bg-white shadow-xl" dir="rtl">
        <h3 className="mb-4 text-right text-xl font-extrabold text-gray-800">
          {hebrewDictionary.confirmImageUplaod}
        </h3>

        <div className="mb-6 flex justify-center">
          <Image
            src={image ? URL.createObjectURL(image) : "/logo.png"}
            alt="User"
            width={100}
            height={100}
            className="rounded-full border border-gray-300 object-cover shadow-sm"
          />
        </div>

        <div className="mt-6 flex items-center justify-between px-2">
          <button
            className="text-sm text-green-600 transition duration-300 ease-in-out hover:text-green-800 hover:underline"
            onClick={() => {
              handleUpload();
              setShowModal(false);
              setProfileImage(null);
            }}
          >
            {hebrewDictionary.confirm}
          </button>
          <button
            className="text-sm text-red-600 transition duration-300 ease-in-out hover:text-red-800 hover:underline"
            onClick={() => {
              setShowModal(false);
              setProfileImage(null);
            }}
          >
            {hebrewDictionary.cancel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ImageConfirmModal;
