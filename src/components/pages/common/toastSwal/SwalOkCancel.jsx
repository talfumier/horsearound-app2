import swal from "sweetalert";
import {padToNDigits} from "../../utils/utilityFunctions.js";
import "./swal.css";

export async function SwalOkCancel(formatMessage, id1, id2) {
  let text = `${formatMessage({id: id1})}`;
  if (id2)
    text = `${text}
  ${formatMessage({id: id2})}`;
  const confirm = (await swal({
    text,
    icon: "warning", //info,error,success
    buttons: [
      `${formatMessage({
        id: "buttons.cancelButton",
      })}`,
      `${formatMessage({
        id: "buttons.okButton",
      })}`,
    ],
    closeOnClickOutside: false,
    dangerMode: true,
  }))
    ? true
    : false;
  if (!confirm) return "cancel";
  return "ok";
}
export function formatTimer(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${padToNDigits(minutes, 2)}:${padToNDigits(seconds, 2)}`;
}
export async function SwalOkCancelWithTimer(
  formatMessage,
  id1,
  id2,
  closeInSeconds
) {
  const timer = setInterval(() => {
    closeInSeconds--;
    if (closeInSeconds < 0) {
      clearInterval(timer);
      swal.close();
      return ["cancel", 1];
    }
    document.getElementsByClassName(
      "swal-title"
    )[0].textContent = `${formatTimer(
      closeInSeconds >= 0 ? closeInSeconds : 0
    )}`;
  }, 1000);

  const confirm = (await swal({
    title: formatTimer(closeInSeconds),
    text: `${formatMessage({id: id1})} 

    ${formatMessage({
      id: id2,
    })}`,
    //timer: closeInSeconds * 1000,
    //icon: "warning",
    buttons: [
      `${formatMessage({
        id: "buttons.cancelButton",
      })}`,
      `${formatMessage({
        id: "buttons.extendButton",
      })}`,
    ],
    closeOnClickOutside: false,
    dangerMode: true,
  }))
    ? true
    : false;
  clearInterval(timer);
  return [confirm ? "ok" : "cancel", closeInSeconds];
}
