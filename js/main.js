(function () {
  var views = Array.prototype.slice.call(document.querySelectorAll(".view"));

  function show(id) {
    var current = document.getElementById(id);
    if (!current || !current.classList.contains("view")) current = document.getElementById("info");
    views.forEach(function (view) {
      view.hidden = view !== current;
    });
    document.querySelectorAll("nav a").forEach(function (link) {
      var on = link.getAttribute("href") === "#" + current.id;
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("hashchange", function () {
    show(location.hash.slice(1));
  });

  show(location.hash.slice(1));
})();
