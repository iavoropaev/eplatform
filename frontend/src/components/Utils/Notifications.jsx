import { toast } from "react-toastify";

export const showError = (text) => toast.error(text);
export const showOK = (text) => toast.success(text);
