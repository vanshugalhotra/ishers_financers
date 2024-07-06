// toastify
import { toast } from "react-toastify";

export function raiseToast(type, message) {
  const toastOptions = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case "success":
      toast.success(message, { ...toastOptions });
      break;
    case "error":
      toast.error(message, { ...toastOptions });
      break;
    default:
      toast.info(message, { ...toastOptions });
  }
}
