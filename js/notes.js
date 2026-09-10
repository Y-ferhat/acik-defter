/* ==========================================================================
   Notlar sayfası — kategori süzgeci.

   JavaScript kapalıysa hiçbir şey olmaz: bütün notlar görünür kalır ve
   ayrıntılar <details> olduğu için yine açılıp kapanır. Süzgeç yalnızca
   bir kolaylık.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var bar = document.querySelector(".filters");
    if (!bar) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
    var notes = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
    var countEl = document.querySelector(".filter-count .num");
    var countLabel = document.querySelector(".filter-count .word");
    var empty = document.querySelector(".empty");
    var active = "all";

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render(animate) {
      var visible = 0;

      notes.forEach(function (note) {
        var match = active === "all" || note.getAttribute("data-cat") === active;
        /* Gizleme anında: display:none. Yalnızca kalanlar kağıda yeniden
           yazılıyormuş gibi beliriyor; süzgecin sonucu hiçbir zaman
           animasyonu beklemiyor. */
        note.classList.toggle("is-hidden", !match);
        if (!match) return;
        if (animate && !reduce && typeof note.animate === "function") {
          note.animate(
            [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
            { duration: 320, delay: Math.min(visible, 8) * 45, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
          );
        }
        visible++;
      });

      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === active));
      });

      var lang = document.documentElement.getAttribute("lang");
      /* Sayı da dilin bir parçası: Farsça'da tarihlerle aynı rakamlar. */
      if (countEl) countEl.textContent = localizeDigits(String(visible), lang);
      if (countLabel) {
        var dict = translations[lang] || {};
        var key = visible === 1 ? "notes_count_one" : "notes_count_many";
        if (dict[key]) countLabel.textContent = dict[key];
      }
      if (empty) empty.hidden = visible !== 0;
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        active = b.getAttribute("data-filter");
        render(true);
      });
    });

    /* Dil değişince tekil/çoğul etiketi de yenilenmeli. */
    document.addEventListener("site:lang", function () { render(false); });

    render(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
