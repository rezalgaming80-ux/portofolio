const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const mobileNav = document.querySelector("#mobileNav");
const year = document.querySelector("#year");

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  localStorage.setItem("ryuto-theme", theme);
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap",
  );
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  themeMeta?.setAttribute("content", theme === "dark" ? "#0b1019" : "#f2f8f7");
};

applyTheme(root.dataset.theme);

themeToggle?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Tutup menu navigasi" : "Buka menu navigasi",
  );
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

year.textContent = new Date().getFullYear();

window.addEventListener("load", () => {
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
});

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px 0px" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navLinks = document.querySelectorAll(".nav-link, .mobile-nav a");
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            ),
          );
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((section) => activeObserver.observe(section));
}
