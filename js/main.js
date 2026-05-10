import { navigateTo, router } from "./router.js";

document.addEventListener("click", e => {
    const link = e.target.closest("a[data-link]");

    if (!link) return;

    e.preventDefault();
    navigateTo(link.href);
});

// function initMenu() {
//     const toggle = document.getElementById("menu-toggle");
//     const nav = document.getElementById("nav-links");
//     const overlay = document.getElementById("overlay");

//     if (!toggle || !nav || !overlay) return;

//     const toggleMenu = () => {
//         nav.classList.toggle("active");
//         overlay.classList.toggle("active");
//         document.body.classList.toggle("menu-open");
//     };

//     toggle.addEventListener("click", toggleMenu);

//     overlay.addEventListener("click", toggleMenu);

//     document.querySelectorAll("[data-link]").forEach(link => {
//         link.addEventListener("click", () => {
//             nav.classList.remove("active");
//             overlay.classList.remove("active");
//             document.body.classList.remove("menu-open");
//         });
//     });
// }

function initMenu() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-links");
    const overlay = document.getElementById("overlay");

    if (!toggle || !nav || !overlay) return;

    const openMenu = () => {
        nav.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("menu-open");
        toggle.classList.add("active");
    };

    const closeMenu = () => {
        nav.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
        toggle.classList.remove("active");
    };

    const toggleMenu = () => {
        if (nav.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    toggle.addEventListener("click", toggleMenu);

    overlay.addEventListener("click", closeMenu);

    document.querySelectorAll("[data-link]").forEach(link => {
        link.addEventListener("click", closeMenu);
    });
}

initMenu();

window.addEventListener("popstate", router);

if (!document.body.classList.contains("static-page")) {
    router();
}