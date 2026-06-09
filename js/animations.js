(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getRevealItems() {
    return Array.from(document.querySelectorAll(".reveal, [data-reveal]"));
  }

  function applyStagger() {
    if (reduced) return;

    document.querySelectorAll(".section, .hero, .site-footer").forEach((group) => {
      const items = Array.from(group.querySelectorAll(".reveal, [data-reveal]"));
      items.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      });
    });
  }

  function revealImmediately(items) {
    items.forEach((item) => item.classList.add("is-visible"));
  }

  function initReveal() {
    const items = getRevealItems();
    if (!items.length) return;

    applyStagger();

    if (reduced || !("IntersectionObserver" in window)) {
      revealImmediately(items);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  }

  document.addEventListener("DOMContentLoaded", initReveal);
})();
