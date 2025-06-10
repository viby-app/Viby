import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle2 className="text-green-600" />,
    style: {
      background: "#ECFDF5",
      border: "1px solid #A7F3D0",
      color: "#065F46",
      borderRadius: "12px",
      padding: "16px",
    },
  });
};
