(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function initMenu() {
    const toggle = qs(".menu-toggle");
    const nav = qs(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    qsa(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function getProjectCover(project) {
    return project.cover || project.image || "";
  }

  function renderFeatured() {
    const list = qs("[data-featured-list]");
    if (!list || !window.siteProjects) return;

    list.innerHTML = window.siteProjects
      .map((project) => {
        const meta = [project.year, project.status].filter(Boolean).join(" / ");
        return `
          <a class="work-row reveal" href="${project.url}" data-preview="${getProjectCover(project)}">
            <span class="work-number">${project.number}</span>
            <span class="work-title">${project.title}</span>
            <span class="work-type">${project.type}</span>
            <span class="work-meta">
              <span>${meta}</span>
              <span>${project.category || ""}</span>
            </span>
            <span class="work-arrow" aria-hidden="true">→</span>
          </a>
        `;
      })
      .join("");
  }

  function renderWorksPage() {
    const grid = qs("[data-works-grid]");
    if (!grid || !window.siteProjects) return;

    grid.innerHTML = window.siteProjects
      .map(
        (project) => `
          <article class="project-card reveal" id="${project.slug}">
            <a href="${project.url}">
              <div class="image-frame">
                <img src="${getProjectCover(project)}" alt="${project.title}" loading="lazy">
              </div>
              <div class="project-card-meta">
                <span>${project.number}</span>
                <span>${project.year}</span>
              </div>
              <h2>${project.title}</h2>
              <p>${project.summary}</p>
            </a>
          </article>
        `
      )
      .join("");
  }

  function renderArchive() {
    const grid = qs("[data-archive-grid]");
    if (!grid || !window.archiveItems) return;

    grid.innerHTML = window.archiveItems
      .map(
        (item) => `
          <figure class="archive-item reveal">
            <button class="image-button" type="button" data-lightbox="${item.image}" aria-label="Open ${item.title}">
              <div class="image-frame">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <span class="archive-tag">${item.category}</span>
              </div>
            </button>
            <figcaption>
              <span>${item.title}</span>
              <span>${item.category}</span>
            </figcaption>
          </figure>
        `
      )
      .join("");
  }

  function renderTestimonials() {
    const wrap = qs("[data-testimonials]");
    if (!wrap || !window.testimonials) return;

    wrap.innerHTML = window.testimonials
      .map(
        (item) => `
          <figure class="quote-card reveal">
            <blockquote>${item.quote}</blockquote>
            <figcaption>
              <span>${item.name}</span>
              <span>${item.type}</span>
            </figcaption>
          </figure>
        `
      )
      .join("");
  }

  function initPreview() {
    const rows = qsa(".work-row[data-preview]");
    const preview = qs(".hover-preview");
    if (!rows.length || !preview) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover || prefersReducedMotion) return;

    const img = qs("img", preview);
    let frame = null;
    let lastX = 0;
    let lastY = 0;

    function movePreview() {
      frame = null;
      const previewWidth = preview.offsetWidth || 320;
      const previewHeight = preview.offsetHeight || 240;
      const x = Math.min(lastX + 28, window.innerWidth - previewWidth - 20);
      const y = Math.min(lastY + 24, window.innerHeight - previewHeight - 20);
      preview.style.setProperty("--preview-transform", `translate3d(${Math.max(18, x)}px, ${Math.max(18, y)}px, 0)`);
    }

    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        img.src = row.dataset.preview;
        img.alt = row.querySelector(".work-title")?.textContent || "Project preview";
        preview.classList.add("is-visible");
      });

      row.addEventListener("mousemove", (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        if (!frame) frame = window.requestAnimationFrame(movePreview);
      });

      row.addEventListener("mouseleave", () => {
        preview.classList.remove("is-visible");
      });
    });
  }

  function initLightbox() {
    const lightbox = qs(".lightbox");
    if (!lightbox) return;

    const img = qs(".lightbox img", lightbox);
    const close = qs(".lightbox-close", lightbox);

    function openLightbox(src, alt) {
      if (!src) return;
      img.src = src;
      img.alt = alt || "Preview image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lock-scroll");
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lock-scroll");
    }

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lightbox]");
      if (!button) return;
      const image = qs("img", button);
      openLightbox(button.dataset.lightbox, image?.alt);
    });

    close?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function initProjectGallery() {
    qsa(".project-image").forEach((button) => {
      const image = qs("img", button);
      button.setAttribute("data-lightbox", button.dataset.image || image?.src || "");
    });
  }

  function markLoaded() {
    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    }
    window.setTimeout(() => document.body.classList.add("is-loaded"), 80);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderWorksPage();
    renderArchive();
    renderTestimonials();
    initMenu();
    initProjectGallery();
    initPreview();
    initLightbox();
    markLoaded();
  });
})();
