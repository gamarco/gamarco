import { initHeroAnimation } from "./animation.js";
import { initContactForm } from "./contact.js";
import { initServicesPage } from "./services.js";
import { initSobrePage } from "./about.js";
import { initAprendaPage } from "./learn.js";
import { initEquipePage } from "./team.js";

const routes = {
    "/": "pages/inicio.html",
    "/inicio": "pages/inicio.html",
    "/gamarco": "pages/gamarco.html",
    "/equipe": "pages/equipe.html",
    "/solucoes": "pages/solucoes.html",
    "/aprenda": "pages/aprenda.html",
    "/dupla-matricula-aee": "pages/conteudos/dupla-matricula-aee.html",
    "/fundeb": "pages/conteudos/fundeb.html",
    "/contato": "pages/contato.html"
};

const titles = {
    "/": "Gamarco | Consultoria Educacional para Gestão Pública",
    "/inicio": "Gamarco | Consultoria Educacional para Gestão Pública",
    "/gamarco": "Sobre | Gamarco",
    "/equipe": "Equipe | Gamarco",
    "/solucoes": "Soluções em Gestão Educacional | Gamarco",
    "/aprenda": "Conteúdos | Gamarco",
    "/contato": "Contato | Gamarco",
    "/dupla-matricula-aee": "Dupla Matrícula no AEE | Gamarco",
    "/fundeb": "Conheça o FUNDEB | Gamarco"
};

function updateLogos(path) {
    const logoMenu = document.querySelector(".logo-img");
    const logoFooter = document.querySelector(".footer-logo");

    const isHome = path === "/" || path === "/inicio";

    if (logoMenu) {
        logoMenu.src = isHome
            ? "assets/images/logo_light.webp"
            : "assets/images/logo_dark.webp";
    }

    if (logoFooter) {
        logoFooter.src = "assets/images/logo_light.webp";
    }
}

function getCurrentPath() {
    if (window.location.hash) {
        return window.location.hash.replace("#", "") || "/";
    }

    return window.location.pathname || "/";
}

export function navigateTo(url) {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;

    history.pushState(null, null, path);
    router();
}

export async function router() {
    let path = getCurrentPath();

    if (!routes[path]) {
        path = "/";
        history.replaceState(null, null, "/");
    }

    const route = routes[path];

    const html = await fetch(route).then(res => res.text());
    document.querySelector("#app").innerHTML = html;

    document.title = titles[path] || "Gamarco | Consultoria Educacional";

    const footer = document.querySelector("footer");
    const body = document.body;

    body.classList.remove("home", "internal", "static-page");

    if (path === "/" || path === "/inicio") {
        body.classList.add("home");

        if (footer) footer.style.display = "none";

        initHeroAnimation();
    } else {
        body.classList.add("internal");

        if (footer) footer.style.display = "block";
    }

    updateLogos(path);

    if (path === "/contato") {
        initContactForm();
    }

    if (path === "/solucoes") {
        initServicesPage();
    }

    if (path === "/gamarco") {
        initSobrePage();
    }

    if (path === "/equipe") {
        initEquipePage();
    }

    if (path === "/aprenda") {
        initAprendaPage();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}