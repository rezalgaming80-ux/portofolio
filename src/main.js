const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const siteClock = document.querySelector("#site-clock");
const clockHours = document.querySelector("#clock-hours");
const clockMinutes = document.querySelector("#clock-minutes");
const clockSeconds = document.querySelector("#clock-seconds");

const savedTheme = localStorage.getItem("ryuto-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)")
  .matches
  ? "light"
  : "dark";
root.dataset.theme = savedTheme || preferredTheme;

function syncThemeUI() {
  const isLight = root.dataset.theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeLabel.textContent = isLight ? "mode gelap" : "mode terang";
  themeIcon.textContent = isLight ? "◑" : "◐";
}

syncThemeUI();

function updateClock() {
  if (!siteClock) return;

  const now = new Date();
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  if (clockHours) clockHours.textContent = values.hour;
  if (clockMinutes) clockMinutes.textContent = values.minute;
  if (clockSeconds) clockSeconds.textContent = values.second;
  siteClock.dateTime = now.toISOString();
}

updateClock();
setInterval(updateClock, 1000);

themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("ryuto-theme", root.dataset.theme);
  syncThemeUI();
});

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -30px 0px" },
  );
  revealItems.forEach((item) => observer.observe(item));
}

document.getElementById("current-year").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const contactEndpoint = "https://formsubmit.co/ajax/ryuto.akira28@gmail.com";

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  formStatus.textContent = "Mengirim sinyal...";

  try {
    const response = await fetch(contactEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Pesan portofolio dari ${name}`,
        _template: "table",
      }),
    });

    if (!response.ok) throw new Error("Pengiriman gagal");

    contactForm.reset();
    formStatus.textContent = "Sinyal terkirim. Terima kasih!";
  } catch (error) {
    formStatus.textContent =
      "Sinyal belum terkirim. Coba lagi beberapa saat lagi.";
  }
});
