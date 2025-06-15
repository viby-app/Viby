import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: (
      <div className="flex items-center justify-center">
        <CheckCircle2 className="text-green-500" size={22} />
      </div>
    ),
    style: {
      backgroundColor: "#F0FDF4",
      border: "1px solid #86EFAC",
      color: "#166534",
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    position: "bottom-center", // 👈 זה מה ששמת לב אליו
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
