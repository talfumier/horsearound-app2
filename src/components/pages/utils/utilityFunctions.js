import {parseISO, format, isDate} from "date-fns";
import _ from "lodash";
import img from "../home/img/deal/deal-01.jpg";

export function isEven(n) {
  return n % 2 === 0;
}
export function getMainImage(images) {
  try {
    if (!images || images.length === 0) return img;
    let idx = -1;
    images.map((image, i) => {
      if (image.main) idx = i;
    });
    return idx >= 0 ? images[idx].data : images[0].data;
  } catch (error) {
    return img;
  }
}
export function getDateStatus(date, participantMax, participantMin, type) {
  if (type === "pro") {
    return typeof date.bookings === "number"
      ? participantMax === date.bookings
        ? "Complet"
        : date.bookings >= participantMin
        ? "Départ garanti"
        : "Départ non garanti"
      : date.bookingsByDay.every(
          (bookingByDay) => participantMax === bookingByDay.bookings
        )
      ? "Complet"
      : date.bookingsByDay.every(
          (bookingByDay) => bookingByDay.bookings >= participantMin
        )
      ? "Départ garanti"
      : "Départ non garanti";
  }
  if (type === "particulier") {
    return typeof date.bookings === "number"
      ? participantMax === date.bookings
        ? "Complet"
        : date.bookings >= participantMin
        ? "Départ garanti"
        : "Départ non garanti"
      : date.bookingsByDay.every(
          (bookingByDay) =>
            // console.log("laaa", bookingByDay.bookings)
            participantMax === bookingByDay.bookings
        )
      ? "Complet"
      : date.bookingsByDay.every(
          (bookingByDay) => bookingByDay.bookings >= participantMin
        )
      ? "Départ garanti"
      : "Départ non garanti";
  }
}
export function testGuaranteedDeparture(dates, participantMin, participantMax) {
  // let complet = false,
  // guaranteed;
  let text = null,
    status = null;
  dates.map((date) => {
    status = getDateStatus(date, participantMax, participantMin, "particulier");
    if (status === "Départ garanti") text += 1;
  });
  if (text !== null)
    return "src.components.announcePage.announceDetailTab.moreInfoTable.guaranteedDeparture";
  return "src.components.announcePage.announceDetailTab.moreInfoTable.nonGuaranteedDeparture";
}
export function testPromo(dates) {
  let text = null;
  dates.forEach((date) => {
    if (date.promotion && date.promotion !== null) text += 1;
  });
  if (text !== null) return "Promo";
}
export function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}
export function randomInteger(n) {
  return Math.floor(Math.random() * (n + 1)); //random integer between 0 and n
}
export function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
export function getNRandomColors(n) {
  if (n <= 0) return null;
  const colors = [];
  let i = 0;
  for (i in range(1, n)) {
    colors.push(getRandomColor());
  }
  return colors;
}
export function getFormattedDate(date, frmt) {
  if (typeof frmt === "undefined") frmt = "dd.MM.yyyy HH:mm";
  try {
    if (_.isString(date)) {
      if (date.length > 0) return format(parseISO(date), frmt);
      else return "";
    }
    if (isDate(date)) return format(date, frmt);
  } catch (error) {
    console.log("Error in getFormattedDate - utilityFunctions", error);
  }
}
export function getKeys(type, messages) {
  //activities/subactivities, continents/countries keys
  const keys = [];
  let ky = [];
  Object.keys(messages)
    .filter(
      (key) =>
        key.startsWith(`src.components.allPages.Menu.navbar.${type[0]}`) &&
        key.indexOf(type[1]) !== -1
    )
    .map((key) => {
      ky = key.split(".");
      keys.push([ky[7], ky[9]]);
    });
  return keys;
}
export function sumOfPropsValues(obj) {
  return Object.values(obj).reduce((sum, value) => {
    return sum + value; //sum up object's props values
  }, 0);
}
export function padToNDigits(num, n) {
  return num.toString().padStart(n, "0");
}
export function scrollToBottom(id) {
  const elemt = document.getElementById(id);
  if (!elemt) return;
  elemt.scrollTop = elemt.scrollHeight;
}
