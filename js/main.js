(function () {
  var sheets = Array.prototype.slice.call(document.querySelectorAll(".sheet"));
  var railLinks = Array.prototype.slice.call(document.querySelectorAll(".rail a"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("header nav a"));
  var ticking = false;

  function setActive(id) {
    railLinks.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    navLinks.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function update() {
    ticking = false;
    var line = window.innerHeight * 0.45;
    var current = "info";
    sheets.forEach(function (sheet) {
      if (sheet.getBoundingClientRect().top <= line) current = sheet.id;
    });
    setActive(current);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function measureChrome() {
    var foot = document.querySelector(".foot");
    var bar = document.querySelector(".bar");
    if (foot) {
      document.documentElement.style.setProperty("--foot-h", foot.offsetHeight + "px");
    }
    if (bar) {
      document.documentElement.style.setProperty("--head-h", bar.offsetHeight + "px");
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", function () {
    measureChrome();
    requestUpdate();
  });
  window.addEventListener("hashchange", requestUpdate);
  measureChrome();
  update();
})();
