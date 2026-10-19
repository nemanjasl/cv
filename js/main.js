(function () {
  var views = Array.prototype.slice.call(document.querySelectorAll(".view"));
  var order = ["info", "offer", "we", "about", "contact"];
  var switching = false;
  var touchY = null;

  function currentView() {
    return views.filter(function (view) {
      return !view.hidden;
    })[0];
  }

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
    return current;
  }

  function go(id) {
    var current = show(id);
    window.scrollTo(0, 0);
    if (location.hash !== "#" + current.id) {
      history.pushState(null, "", "#" + current.id);
    }
    switching = true;
    window.setTimeout(function () {
      switching = false;
    }, 350);
  }

  function step(direction) {
    var current = currentView();
    if (!current) return;
    var index = order.indexOf(current.id);
    var next = order[index + direction];
    if (next) go(next);
  }

  function atTop() {
    return window.scrollY <= 2;
  }

  function atBottom() {
    var doc = document.documentElement;
    return window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
  }

  function contentSeen() {
    var current = currentView();
    if (!current) return atBottom();
    return current.getBoundingClientRect().bottom <= window.innerHeight + 2 || atBottom();
  }

  window.addEventListener(
    "wheel",
    function (event) {
      if (switching || Math.abs(event.deltaY) < 4) return;
      if (event.deltaY > 0 && contentSeen()) {
        event.preventDefault();
        step(1);
      } else if (event.deltaY < 0 && atTop()) {
        event.preventDefault();
        step(-1);
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", function (event) {
    if (switching) return;
    if ((event.key === "PageDown" || event.key === "ArrowDown") && contentSeen()) {
      event.preventDefault();
      step(1);
    } else if ((event.key === "PageUp" || event.key === "ArrowUp") && atTop()) {
      event.preventDefault();
      step(-1);
    }
  });

  window.addEventListener(
    "touchstart",
    function (event) {
      touchY = event.changedTouches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    function (event) {
      if (switching || touchY === null) return;
      var distance = touchY - event.changedTouches[0].clientY;
      touchY = null;
      if (distance > 60 && contentSeen()) step(1);
      else if (distance < -60 && atTop()) step(-1);
    },
    { passive: true }
  );

  window.addEventListener("hashchange", function () {
    show(location.hash.slice(1));
    window.scrollTo(0, 0);
  });

  show(location.hash.slice(1));
})();
