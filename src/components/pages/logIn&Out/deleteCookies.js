export function deleteCookies(
  removeCookie,
  cookiesTodelete = ["filter", "user"]
) {
  //remove all app related cookies when using default cookiesTodelete
  cookiesTodelete.map((cookie) => {
    removeCookie(cookie, {path: "/"});
  });
  window.localStorage.removeItem("spareToken");
}
