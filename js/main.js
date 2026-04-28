import { navigateTo, router } from "./router.js";

document.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

function initMenu() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-links");
    const overlay = document.getElementById("overlay");

    if (!toggle || !nav || !overlay) return;

    const toggleMenu = () => {
        nav.classList.toggle("active");
        overlay.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    };

    toggle.addEventListener("click", toggleMenu);

    overlay.addEventListener("click", toggleMenu);

    document.querySelectorAll("[data-link]").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            overlay.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });
}

initMenu();

window.addEventListener("popstate", router);

if (!document.body.classList.contains("static-page")) {
    router();
}