async function loadComponent(selector, filePath) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  try {
    const versionedPath = `${filePath}?v=${Date.now()}`;

    const response = await fetch(versionedPath, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Gagal mengambil ${filePath}: ${response.status}`
      );
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <p style="padding:16px;text-align:center">
        Komponen gagal dimuat.
      </p>
    `;
  }
}

function initializeNavbar() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

function initializeNavbarScroll() {
  const header = document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  function updateNavbarState() {
    header.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );
  }

  updateNavbarState();

  window.addEventListener(
    "scroll",
    updateNavbarState,
    {
      passive: true
    }
  );
}

function setActiveNavbar() {
  const currentPage = document.body.dataset.page;

  if (!currentPage) {
    return;
  }

  const activeLink = document.querySelector(
    `[data-nav] [data-page="${currentPage}"]`
  );

  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

function setFooterYear() {
  const yearElement = document.querySelector(
    "[data-footer-year]"
  );

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

async function initializeComponents() {
  await Promise.all([
    loadComponent(
      "#navbar-container",
      "components/navbar.html"
    ),
    loadComponent(
      "#footer-container",
      "components/footer.html"
    )
  ]);

  initializeNavbar();
  initializeNavbarScroll();
  setActiveNavbar();
  setFooterYear();
}

document.addEventListener(
  "DOMContentLoaded",
  initializeComponents
);