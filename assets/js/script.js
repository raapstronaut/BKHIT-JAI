/* =========================================================
   TAHUN OTOMATIS
========================================================= */

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});


/* =========================================================
   ANIMASI REVEAL
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* =========================================================
   FILTER SPESIES
   Tetap aman untuk halaman lain
========================================================= */

const filterInput = document.querySelector(
  "[data-filter-input]"
);

const speciesCards = [
  ...document.querySelectorAll("[data-species]")
];

const noResults = document.querySelector(
  "[data-no-results]"
);

function filterSpecies(value) {
  const query = value.trim().toLowerCase();
  let visibleCount = 0;

  speciesCards.forEach((card) => {
    const searchableText = [
      card.dataset.species || "",
      card.textContent || ""
    ]
      .join(" ")
      .toLowerCase();

    const shouldShow =
      query === "" ||
      searchableText.includes(query);

    card.hidden = !shouldShow;

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }
}

if (filterInput) {
  const searchParams = new URLSearchParams(
    window.location.search
  );

  const initialQuery =
    searchParams.get("q") || "";

  filterInput.value = initialQuery;
  filterSpecies(initialQuery);

  filterInput.addEventListener("input", (event) => {
    filterSpecies(event.target.value);
  });
}


/* =========================================================
   LIGHTBOX GALERI
   Tetap aman untuk halaman lain
========================================================= */

const lightbox = document.querySelector(
  "[data-lightbox]"
);

const lightboxImage = document.querySelector(
  "[data-lightbox-img]"
);

const lightboxCaption = document.querySelector(
  "[data-lightbox-caption]"
);

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.style.overflow = "";
}

document
  .querySelectorAll("[data-gallery-open]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) {
        return;
      }

      lightboxImage.src =
        button.dataset.src || "";

      if (lightboxCaption) {
        lightboxCaption.textContent =
          button.dataset.caption || "";
      }

      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

document
  .querySelector("[data-lightbox-close]")
  ?.addEventListener(
    "click",
    closeLightbox
  );

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


/* =========================================================
   RINGKASAN ARTIKEL
========================================================= */

document
  .querySelectorAll(".article-toggle")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const extraContent =
        button.nextElementSibling;

      if (!extraContent) {
        return;
      }

      const willOpen = extraContent.hidden;

      extraContent.hidden = !willOpen;

      button.textContent = willOpen
        ? "Tutup ringkasan ↑"
        : "Baca ringkasan lengkap →";
    });
  });


/* =========================================================
   PDF PLACEHOLDER
========================================================= */

document
  .querySelectorAll("[data-pdf-link]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        !link.classList.contains(
          "is-placeholder"
        )
      ) {
        return;
      }

      event.preventDefault();

      alert(
        "File PDF belum dimasukkan. " +
        "Salin PDF ke folder assets/pdf, " +
        'lalu hapus class "is-placeholder" ' +
        "pada tautan tersebut."
      );
    });
  });


/* =========================================================
   POPUP DETAIL JAI
========================================================= */

const jaiDetailModal = document.querySelector(
  "[data-jai-detail-modal]"
);

const jaiDetailContents = [
  ...document.querySelectorAll(
    "[data-jai-content]"
  )
];

let lastJaiTrigger = null;


/* Membuka popup sesuai nama kategori */

function openJaiDetail(name, trigger) {
  if (!jaiDetailModal) {
    console.error(
      "Popup JAI tidak ditemukan. " +
      "Pastikan HTML memiliki atribut " +
      "[data-jai-detail-modal]."
    );

    return;
  }

  const selectedContent =
    document.querySelector(
      `[data-jai-content="${name}"]`
    );

  if (!selectedContent) {
    console.error(
      `Konten popup "${name}" tidak ditemukan.`
    );

    return;
  }

  jaiDetailContents.forEach((content) => {
    content.hidden = true;
  });

  selectedContent.hidden = false;
  jaiDetailModal.hidden = false;

  lastJaiTrigger = trigger;

  document.body.classList.add(
    "jai-detail-open"
  );

  requestAnimationFrame(() => {
    jaiDetailModal
      .querySelector(
        ".jai-detail-modal__close"
      )
      ?.focus();
  });
}


/* Menutup popup */

function closeJaiDetail() {
  if (!jaiDetailModal) {
    return;
  }

  jaiDetailModal.hidden = true;

  jaiDetailContents.forEach((content) => {
    content.hidden = true;
  });

  document.body.classList.remove(
    "jai-detail-open"
  );

  if (lastJaiTrigger) {
    lastJaiTrigger.focus();
  }

  lastJaiTrigger = null;
}


/* Event tombol buka dan tutup popup */

document.addEventListener("click", (event) => {
  const openButton = event.target.closest(
    "[data-jai-open]"
  );

  if (openButton) {
    event.preventDefault();

    openJaiDetail(
      openButton.dataset.jaiOpen,
      openButton
    );

    return;
  }

  const closeButton = event.target.closest(
    "[data-jai-close]"
  );

  if (closeButton) {
    event.preventDefault();
    closeJaiDetail();
  }
});


/* Tutup popup atau lightbox dengan Escape */

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeLightbox();

  if (
    jaiDetailModal &&
    !jaiDetailModal.hidden
  ) {
    closeJaiDetail();
  }
});