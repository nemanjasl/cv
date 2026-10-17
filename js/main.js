(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var narrow = window.matchMedia("(max-width: 900px)");
  var reel = document.querySelector(".reel");
  var track = document.getElementById("reelTrack");
  var bar = document.getElementById("progress");
  var nav = document.querySelector(".nav");
  var overlay = document.getElementById("overlay");
  var year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  function syncReel() {
    if (!reel || !track || reduce || narrow.matches) {
      if (track) track.style.transform = "";
      return;
    }
    var total = reel.offsetHeight - window.innerHeight;
    var scrolled = Math.min(Math.max(-reel.getBoundingClientRect().top, 0), total);
    var progress = total > 0 ? scrolled / total : 0;
    var max = track.scrollWidth - window.innerWidth;
    track.style.transform = "translate3d(" + -progress * max + "px,0,0)";
  }

  function onScroll() {
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var p = height > 0 ? window.scrollY / height : 0;
    if (bar) bar.style.width = Math.min(100, p * 100) + "%";
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
    syncReel();
  }

  document.querySelectorAll("[data-open-contact]").forEach(function (button) {
    button.addEventListener("click", function () {
      overlay.hidden = false;
      document.body.classList.add("contact-open");
      var close = overlay.querySelector("[data-close-contact]");
      if (close) close.focus();
    });
  });

  function closeContact() {
    overlay.hidden = true;
    document.body.classList.remove("contact-open");
  }

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay || event.target.closest("[data-close-contact]")) {
      closeContact();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !overlay.hidden) closeContact();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncReel);
  narrow.addEventListener("change", syncReel);
  onScroll();
})();
