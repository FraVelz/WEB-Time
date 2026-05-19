(function () {
  try {
    var k = "web-time-theme";
    var s = localStorage.getItem(k);
    var t =
      s === "light" || s === "dark"
        ? s
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    document.documentElement.dataset.theme = t;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
