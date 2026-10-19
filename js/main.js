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

  var navId = null;
  var navY = 0;
  var navTimer = null;

  // On mobile the middle of the page scrolls instead of the window,
  // so the browser keeps its own header and footer on screen.
  var mainEl = document.querySelector("main");

  function innerScroller() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function scrollPos() {
    return innerScroller() ? mainEl.scrollTop : window.scrollY;
  }

  function scrollToPos(top, behavior) {
    if (innerScroller()) {
      mainEl.scrollTo({ top: top, behavior: behavior });
    } else {
      window.scrollTo({ top: top, behavior: behavior });
    }
  }

  function update() {
    ticking = false;
    // While a click is scrolling to its target, keep that item selected
    // instead of letting the sections passed on the way flicker through.
    if (navId !== null) {
      if (Math.abs(scrollPos() - navY) <= 3) {
        navId = null;
      } else {
        setActive(navId);
        return;
      }
    }
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

  // Sticky sheets report their stuck position, so a plain anchor click
  // cannot scroll back to an earlier sheet (the browser thinks it is
  // already on screen, under the later sheets). Work out each sheet's
  // natural position in the document and scroll there explicitly.
  function naturalTop(sheet) {
    var container = document.querySelector(".sheets");
    var origin = innerScroller() ? mainEl.getBoundingClientRect().top : 0;
    var top = container.getBoundingClientRect().top - origin + scrollPos();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i] === sheet) break;
      top +=
        sheets[i].offsetHeight +
        parseFloat(window.getComputedStyle(sheets[i]).marginBottom);
    }
    return top;
  }

  function targetScroll(id) {
    if (id === "info") return 0;
    var sheet = document.getElementById(id);
    if (!sheet) return null;
    var stickyTop = parseFloat(window.getComputedStyle(sheet).top);
    return Math.max(0, naturalTop(sheet) - stickyTop);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('a[href^="#"]'),
    function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href").slice(1);
        var target = targetScroll(id);
        if (target === null) return;
        event.preventDefault();
        if (window.location.hash !== "#" + id) {
          window.history.pushState(null, "", "#" + id);
        }
        navId = id;
        navY = target;
        if (navTimer) window.clearTimeout(navTimer);
        navTimer = window.setTimeout(function () {
          navId = null;
          requestUpdate();
        }, 2000);
        setActive(id);
        scrollToPos(target, "smooth");
      });
    }
  );

  function onScroll() {
    // If the user takes over scrolling mid-animation, release the lock
    // shortly after scrolling stops.
    if (navId !== null) {
      if (navTimer) window.clearTimeout(navTimer);
      navTimer = window.setTimeout(function () {
        navId = null;
        requestUpdate();
      }, 300);
    }
    requestUpdate();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  mainEl.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    measureChrome();
    requestUpdate();
  });
  window.addEventListener("hashchange", requestUpdate);
  measureChrome();
  // Land on the right sheet when arriving with a hash in the address.
  if (window.location.hash.length > 1) {
    var initialId = window.location.hash.slice(1);
    var initialTarget = targetScroll(initialId);
    if (initialTarget !== null) {
      scrollToPos(initialTarget, "auto");
      setActive(initialId);
    }
  }
  update();
})();
