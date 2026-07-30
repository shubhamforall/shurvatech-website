const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("[data-nav-link]").forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});
