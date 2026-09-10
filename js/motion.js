/* ==========================================================================
   Hareket — kaydırınca beliren kayıtlar, mürekkeple çizilen başlık çizgileri,
   imleci izleyen lamba ışığı.

   Üç kural:
   - Hareketi azaltmayı seçmiş kullanıcıda hiçbir şey çalışmaz; script en
     başta çıkar. CSS de aynı tercihte bütün geçişleri kapatıyor.
   - Hiçbir şey CSS'te varsayılan olarak gizli değil: .reveal sınıfını buradan
     ekliyoruz. JavaScript kapalıysa ya da IntersectionObserver yoksa içerik
     olduğu gibi durur.
   - Lamba yalnızca fare olan cihazda bağlanıyor; dokunmatik ekranda ışık
     sağ üstte sabit kalıyor (CSS'teki varsayılan konum).
   ========================================================================== */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  /* -------------------------------------------------------------- lamba */

  function initLamp() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var root = document.documentElement;
    var x = 0, y = 0, raf = 0;

    function paint() {
      raf = 0;
      root.style.setProperty("--mx", x + "px");
      root.style.setProperty("--my", y + "px");
    }

    window.addEventListener("pointermove", function (e) {
      x = e.clientX;
      y = e.clientY;
      /* Her olayda değil, karede bir boyuyoruz. */
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });

    root.classList.add("has-lamp");
  }

  /* ------------------------------------------------------------ belirme */

  var SELECTOR = [
    ".hero-copy > *",
    ".hero-card",
    ".section-head h2",
    ".section-head a",
    ".pcard",
    ".noteitem",
    ".rail-item",
    ".now-band",
    ".band",
    ".card",
    ".facts",
    ".page-head > *",
    ".filters",
    ".prose > *",
    ".intro > *",
  ].join(", ");

  function initReveal() {
    if (!("IntersectionObserver" in window)) return;

    var items = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    if (!items.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.02 }
    );

    items.forEach(function (el, i) {
      el.classList.add("reveal");
      /* Kardeşler peş peşe belirsin; gecikme birikmesin diye altıda duruyor. */
      el.style.transitionDelay = Math.min(i, 6) * 60 + "ms";
      io.observe(el);
    });
  }

  function init() {
    initLamp();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
