(function () {
  const k = "web-time-theme";
  const maxAge = 60 * 60 * 24 * 365;

  function readCookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;max-age=" + maxAge + ";SameSite=Lax";
  }

  try {
    const fromCookie = readCookie(k);

    const theme =
      fromCookie === "light" || fromCookie === "dark"
        ? fromCookie
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";

    document.documentElement.dataset.theme = theme;
    writeCookie(k, theme);

  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
