import {toast} from "react-toastify";

export function toastSuccess(msg) {
  return toast.success(msg, {
    progressClassName: "error-progress-bar",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
export function toastWarning(msg) {
  return toast.warning(msg, {
    progressClassName: "error-progress-bar",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
export function toastError(msg) {
  return toast.error(msg, {
    progressClassName: "error-progress-bar",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
export function toastInfo(msg) {
  return toast.info(msg, {
    progressClassName: "error-progress-bar",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
